<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import {leaves, fetchLeaveRequests} from '../store';
    import Logout from './Logout.svelte';
    import LeavesPagination from './LeavesPagination.svelte';

    let error = '';

    const updateLeaveStatus = async (leave_id, status) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/leaves/${leave_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                const { message } = await response.json();
                throw new Error(message);
            }

            await fetchLeaveRequests();
            alert(`Leave request ${status === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
        } catch (err) {
            error = err.message;
            console.error('Error updating leave status:', error);
        }
    };

    const goToAdminDashboard = () => {
        navigate('/admin');
    };

    const truncateReason = (reason, limit) => {
    // Insert a space every 50 characters for long continuous strings
    const formattedReason = reason.replace(/(.{50})/g, '$1 ');

    const words = formattedReason.split(' ');
    return words.slice(0, limit).join(' ') + (words.length > limit ? '...' : '');
};

    onMount(fetchLeaveRequests);
</script>

<div class="leave-management">
    <h1>Leave Management</h1>
    {#if error}
        <p class="error">{error}</p>
    {/if}

    <table class="leave-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Leave From<br>(MM/DD/YYYY)</th>
                <th>Leave To<br>(MM/DD/YYYY)</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each $leaves as leave}
                <tr>
                    <td>{leave.leave_id}</td>
                    <td>{leave.e_id}</td>
                    <td>{leave.e_name}</td>
                    <td>{new Date(leave.leave_from).toLocaleDateString()}</td>
                    <td>{new Date(leave.leave_to).toLocaleDateString()}</td>
                    <td>
                        <span class="truncated-reason" title={leave.reason}>
                            {truncateReason(leave.reason, 5)}
                        </span>
                    </td>
                    <td>
                        <span class={`status ${leave.status}`}>{leave.status}</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            {#if leave.status === 'pending'}
                                <button class="btn accept" on:click={() => updateLeaveStatus(leave.leave_id, 'accepted')}>Accept</button>
                                <button class="btn reject" on:click={() => updateLeaveStatus(leave.leave_id, 'rejected')}>Reject</button>
                            {/if}
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    <div class="button-container">
        <button class="btn dashboard" on:click={goToAdminDashboard}>Back to Admin Dashboard</button>
    </div>
</div>
<Logout/>
<LeavesPagination/>

<style>
    .leave-management {
        padding: 30px;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        max-width: 1000px; 
        margin: auto;
    }

    h1 {
        font-family: 'Arial', sans-serif;
        margin-bottom: 25px;
        color: #333;
        text-align: center;
        font-size: 24px;
    }

    .error {
        color: red;
        margin-bottom: 20px;
        text-align: center;
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

    .button-container {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

    .action-buttons {
        display: flex; 
        gap: 10px; 
    }

    .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease, transform 0.3s;
    }

    .btn.accept {
        background-color: #28a745;
        color: white;
    }

    .btn.accept:hover {
        background-color: #218838;
        transform: translateY(-2px);
    }

    .btn.reject {
        background-color: #dc3545;
        color: white;
    }

    .btn.reject:hover {
        background-color: #c82333;
        transform: translateY(-2px);
    }

    .btn.dashboard {
        background-color: #007bff;
        color: white;
    }

    .btn.dashboard:hover {
        background-color: #0069d9;
        transform: translateY(-2px);
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
</style>