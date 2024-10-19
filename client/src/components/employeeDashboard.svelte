<script>
    import { onMount } from 'svelte';
    import EditLeaveModal from './EditLeaveModal.svelte';
    import ApplyLeaveModal from './AppyLeaveModal.svelte';
    import Logout from './Logout.svelte';

    let leaveRequests = [];
    let selectedLeaveRequest = null;
    let showEditModal = false;
    let showApplyModal = false;

    const fetchLeaveRequests = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/employees', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include'
            });

            if (response.ok) {
                leaveRequests = await response.json();
            } else {
                console.error('Failed to fetch leave requests');
            }
        } catch (error) {
            console.error('Error fetching leave requests:', error);
        }
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

    onMount(() => {
        fetchLeaveRequests();
    });
</script>

<div class="dashboard">
    <h2>Employee Dashboard</h2>
    <div class="button-container">
        <button class="btn apply-leave" on:click={openApplyModal}>Apply for Leave</button>
    </div>

    <table class="leave-table">
        <thead>
            <tr>
                <th>Leave From</th>
                <th>Leave To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each leaveRequests as leaveRequest}
                <tr>
                    <td>{new Date(leaveRequest.leave_from).toLocaleDateString()}</td>
                    <td>{new Date(leaveRequest.leave_to).toLocaleDateString()}</td>
                    <td>{leaveRequest.reason}</td>
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
                </tr>
            {/each}
        </tbody>
    </table>

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

</style>

