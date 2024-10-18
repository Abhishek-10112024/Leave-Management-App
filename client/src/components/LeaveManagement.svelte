<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import {leaves, fetchLeaveRequests} from '../store';
    import Logout from './Logout.svelte';
    import LeavesPagination from './LeavesPagination.svelte';

    let error = '';

    const updateLeaveStatus = async (leave_id, status) => {
        try {
            const response = await fetch(`http://localhost:3000/api/leaves/${leave_id}`, {
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

            // Refresh leave requests after updating
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

    onMount(fetchLeaveRequests);
</script>

<div class="leave-management">
    <h1>Leave Management</h1>
    {#if error}
        <p class="error">{error}</p>
    {/if}

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Employee ID</th>
                <th>Leave From</th>
                <th>Leave To</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each $leaves as leave}
                <tr>
                    <td>{leave.leave_id}</td>
                    <td>{leave.e_id}</td>
                    <td>{leave.leave_from}</td>
                    <td>{leave.leave_to}</td>
                    <td>{leave.status}</td>
                    <td>
                        {#if leave.status === 'pending'}
                            <button on:click={() => updateLeaveStatus(leave.leave_id, 'accepted')}>Accept</button>
                            <button on:click={() => updateLeaveStatus(leave.leave_id, 'rejected')}>Reject</button>
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    <div class="button-container">
        <button on:click={goToAdminDashboard}>Back to Admin Dashboard</button>
    </div>
</div>
<Logout/>
<LeavesPagination/>
<style>
    .leave-management {
        padding: 20px;
        max-width: 800px;
        margin: auto;
    }

    h1 {
        margin-bottom: 20px;
        color: #333;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }

    th, td {
        border: 1px solid #ccc;
        padding: 10px;
        text-align: left;
    }

    th {
        background-color: #f4f4f4;
    }

    .error {
        color: red;
        margin-bottom: 20px;
    }

    .button-container {
        display: flex;
        justify-content: space-between;
    }

    button {
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #ddd;
    }
</style>
