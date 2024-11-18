<script>
    import { navigate } from 'svelte-routing';
    import Logout from '../authComponents/Logout.svelte';
    import { onMount } from 'svelte';

    const goToLeaveManagement = () => {
        navigate('/leave-management');
    };

    const goToEmployeeManagement = () => {
        navigate('/employee-management');
    };

    onMount(() => {
        const token = localStorage.getItem('token')
        if (!token)
        navigate ('/')
    });
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

/* Flexbox, or the Flexible Box Layout, is a CSS layout model that provides an efficient way to arrange and distribute space among items in a container, even when their size is unknown or dynamic */
    .button-container {
        display: flex;
/* An element with display: flex; or display: inline-flex; becomes a flex container, enabling flexbox properties for its children (flex items). */
        flex-direction: column;
/* set the direction of flex items using the flex-direction property */
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
