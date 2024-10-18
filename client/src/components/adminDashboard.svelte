<script>
    import { navigate } from 'svelte-routing';
    import Logout from './Logout.svelte';

    const goToLeaveManagement = () => {
        navigate('/leave-management');
    };

    const goToEmployeeManagement = () => {
        navigate('/employee-management');
    };
</script>

<div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <div class="button-container">
        <button on:click={goToLeaveManagement}>Manage Leave Requests</button>
        <button on:click={goToEmployeeManagement}>Manage Employees</button>
    </div>
</div>
<Logout/>
<style>
    .admin-dashboard {
        padding: 20px;
        max-width: 600px;
        margin: auto;
        text-align: center;
    }

    h1 {
        margin-bottom: 20px;
        color: #333;
    }

    .button-container {
        display: flex;
        flex-direction: column;
        gap: 15px; /* Space between buttons */
        align-items: center;
    }

    button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 18px;
        transition: background-color 0.3s ease;
        background-color: #007bff;
        color: white;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>
