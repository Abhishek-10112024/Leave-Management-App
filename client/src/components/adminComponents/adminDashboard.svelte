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

    <div class="logout">
        <Logout/>
    </div>
</div>

<style>
    .admin-dashboard {
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        max-width: 90%;
        margin: auto;
        text-align: center;
        background: url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp), linear-gradient(45deg, #49a09d, #5f2c82);   /* Image */
        background-repeat: no-repeat;
        background-position: center; /* Position the image */
        background-size: cover /* Makes sure the background image covers the entire container */
    }

    h1 {
        font-family: 'Arial', sans-serif;
        margin-bottom: 15px;
        margin-top: -10px;
        color: #f9f9f9;
        text-align: center;
        font-size: 30px;
        font-weight: bold;
    }

/* Flexbox, or the Flexible Box Layout, is a CSS layout model that provides an efficient way to arrange and distribute space among items in a container, even when their size is unknown or dynamic */
    .button-container {
        display: flex;
/* An element with display: flex; or display: inline-flex; becomes a flex container, enabling flexbox properties for its children (flex items). */
        flex-direction: row;
/* set the direction of flex items using the flex-direction property */
        gap: 15px; /* Space between buttons */
        justify-content: center;
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
    
    .logout{
        margin-top: 35%; 
    }
</style>
