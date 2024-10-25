<script>
    import { onMount } from 'svelte';
    import EditLeaveModal from './EditLeaveModal.svelte';
    import ApplyLeaveModal from './AppyLeaveModal.svelte';
    import Logout from './Logout.svelte';

    let leaveRequests = [];
    let filteredLeaves = [];
    let selectedLeaveRequest = null;
    let showEditModal = false;
    let showApplyModal = false;

    let currentStatus = 'all'; // Default status to show all leaves
    let currentPage = 1;
    let itemsPerPage = 30;
    let totalItems = 0;

    const fetchLeaveRequests = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/employees/leaves?page=${currentPage}&limit=${itemsPerPage}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                leaveRequests = data.leaves;
                totalItems = data.totalItems;
                filterLeaves(); // Filter leaves after fetching
            } else {
                console.error('Failed to fetch leave requests');
            }
        } catch (error) {
            console.error('Error fetching leave requests:', error);
        }
    };

    const filterLeaves = () => {
        filteredLeaves = currentStatus === 'all' 
            ? leaveRequests 
            : leaveRequests.filter(leave => leave.status === currentStatus);
    };

    const changePage = (page) => {
        currentPage = page;
        fetchLeaveRequests();
    };

    const changeStatus = (status) => {
        currentStatus = status;
        // currentPage = 1; // Reset to first page on status change
        filterLeaves(); // Filter leaves based on the new status
    };

    const openEditModal = (leaveRequest) => {
        selectedLeaveRequest = leaveRequest;
        showEditModal = true;
    };

    const closeEditModal = () => {
        showEditModal = false;
        selectedLeaveRequest = null;
        fetchLeaveRequests();
    };

    const openApplyModal = () => {
        showApplyModal = true;
    };

    const closeApplyModal = () => {
        showApplyModal = false;
        fetchLeaveRequests();
    };

    const truncateReason = (reason, limit) => {
        const formattedReason = reason.replace(/(.{20})/g, '$1 ');
        const words = formattedReason.split(' ');
        return words.slice(0, limit).join(' ') + (words.length > limit ? '...' : '');
    };

    onMount(() => {
        fetchLeaveRequests();
    });
</script>

<div class="dashboard">
    <h2>Employee Dashboard</h2>
    <div class="button-container">
        <button class="btn apply-leave" on:click={openApplyModal}>Apply for Leave</button>
        <div class="status-buttons">
            <button class="btn" on:click={() => changeStatus('all')}>All Leaves</button>
            <button class="btn" on:click={() => changeStatus('pending')}>Pending</button>
            <button class="btn" on:click={() => changeStatus('accepted')}>Accepted</button>
            <button class="btn" on:click={() => changeStatus('rejected')}>Rejected</button>
        </div>
    </div>

    <table class="leave-table">
        <thead>
            <tr>
                <th>Leave From</th>
                <th>Leave To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
                <th>Rejection Reason</th>
            </tr>
        </thead>
        <tbody>
            {#each filteredLeaves as leaveRequest}
                <tr>
                    <td>{new Date(leaveRequest.leave_from).toLocaleDateString()}</td>
                    <td>{new Date(leaveRequest.leave_to).toLocaleDateString()}</td>
                    <td>
                        <span class="truncated-reason" title={leaveRequest.reason}>
                            {truncateReason(leaveRequest.reason, 5)}
                        </span>
                    </td>
                    <td>
                        <span class={leaveRequest.status === 'pending' ? 'status pending' : leaveRequest.status === 'accepted' ? 'status accepted' : 'status rejected'}>
                            {leaveRequest.status}
                        </span>
                    </td>
                    <td>
                        {#if leaveRequest.status === 'pending'}
                            <button class="btn edit" on:click={() => openEditModal(leaveRequest)}>Edit</button>
                        {/if}
                    </td>
                    <td>{leaveRequest.rejectionReason}</td>
                </tr>
            {/each}
        </tbody>
    </table>

    <div class="pagination">
        {#if totalItems > itemsPerPage}
            {#each Array(Math.ceil(totalItems / itemsPerPage)) as _, index}
                <button 
                    class="btn page-button" 
                    on:click={() => changePage(index + 1)} 
                    class:selected={currentPage === index + 1}>
                    {index + 1}
                </button>
            {/each}
        {/if}
    </div>

    {#if showEditModal}
        <EditLeaveModal leaveRequest={selectedLeaveRequest} on:close={closeEditModal} />
    {/if}

    {#if showApplyModal}
        <ApplyLeaveModal on:close={closeApplyModal} />
    {/if}
</div>
<Logout />
<style>
    .dashboard {
        padding: 30px;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        max-width: 1200px;
        margin: auto;
    }

    h2 {
        font-family: 'Arial', sans-serif;
        margin-bottom: 25px;
        color: #333;
        text-align: center;
        font-size: 24px;
    }

    .button-container {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

    .btn {
        padding: 12px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease, transform 0.3s;
        margin: 0 10px;
        width: 150px;
    }

    .btn.apply-leave {
        background-color: #28a745;
        color: white;
    }

    .btn.apply-leave:hover {
        background-color: #218838;
        transform: translateY(-2px);
    }

    .btn.edit {
        background-color: #007bff;
        color: white;
    }

    .btn.edit:hover {
        background-color: #0069d9;
        transform: translateY(-2px);
    }

    .leave-table {
        width: 100%;
        border-collapse: collapse;
        box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        overflow: hidden;
    }

    .leave-table thead {
        background-color: #f5f6f9;
    }

    .leave-table thead th {
        padding: 15px;
        text-align: left;
        font-size: 16px;
        font-weight: 600;
        color: #555;
        border-bottom: 2px solid #eaeaea;
    }

    .leave-table tbody {
        background-color: #ffffff;
    }

    .leave-table tbody tr {
        border-bottom: 1px dotted #ddd;
    }

    .leave-table tbody tr:last-child {
        border-bottom: none;
    }

    .leave-table tbody td {
        padding: 15px;
        font-size: 15px;
        color: #333;
    }

    .leave-table tbody tr:hover {
        background-color: #f1f1f1;
    }

    .status {
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: bold;
    color: white; 
}

.status.pending {
    background-color: #FFA500; 
}

.status.accepted {
    background-color: #28a745; 
}

.status.rejected {
    background-color: #dc3545; 
}

.truncated-reason {
        cursor: pointer;
        position: relative;
        display: inline-block;
    }

    .truncated-reason:hover::after {
        content: attr(title);
        position: absolute;
        left: 0;
        top: 100%;
        white-space: nowrap;
        background: #fff;
        border: 1px solid #ccc;
        padding: 5px;
        z-index: 10;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.page-button {
    padding: 10px 15px;
    margin: 0 5px;
    border: 2px solid #007bff;
    background-color: white;
    color: #007bff;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s, transform 0.3s;
}

.page-button:hover {
    background-color: #007bff;
    color: white;
    transform: translateY(-2px);
}

.page-button.selected {
    background-color: #007bff;
    color: white;
    font-weight: bold;
}

.page-button:disabled {
    background-color: #e0e0e0;
    color: #a0a0a0;
    cursor: not-allowed;
}
.status-buttons {
    display: flex;
    gap: 15px; /* Space between buttons */
    margin-left: auto; /* Align to the right */
}

.btn {
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease, transform 0.3s;
}

.btn:hover {
    transform: translateY(-2px); /* Lift effect on hover */
}

.btn {
    background-color: #007bff; /* Default button color */
    color: white; /* Text color */
}

.btn.selected {
    font-weight: bold; /* Bold text for the selected button */
    border: 2px solid white; /* Outline for the selected button */
    background-color: #0056b3; /* Darker background for selected */
}
</style>

