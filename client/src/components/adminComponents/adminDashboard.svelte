<script>
    import { navigate } from 'svelte-routing';
    import Logout from '../authComponents/Logout.svelte';
    import { onMount } from 'svelte';
    import ProfileModal from '../basicComponents/ProfileModal.svelte';

    let showprofileModal = false;

    const goToLeaveManagement = () => {
        navigate('/leave-management');
    };

    const goToEmployeeManagement = () => {
        navigate('/employee-management');
    };

    const openprofileModal = () => {
        showprofileModal = true;
// This line sets the showApplyModal variable to true, indicating that the modal for applying for leave should be displayed to the user.
    };

    const closeprofileModal = () => {
        showprofileModal = false;
// This line sets the showApplyModal variable to false, indicating that the apply modal should no longer be displayed.
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

    <div>
        <button class="btn user-profile" on:click={openprofileModal}>Profile
            <!-- Person Icon SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg>
        </button>
     </div>   
    

    {#if showprofileModal}
<!-- This line uses Svelte's {#if} block to check the value of the showApplyModal variable. If it is true, the content within this block will be rendered; otherwise, it will not be displayed.  -->
        <ProfileModal on:close={closeprofileModal} />
<!-- on:close={closeApplyModal}: This sets up an event listener for a close event emitted from the ApplyLeaveModal. -->
    {/if}


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
        max-width: 100%;
        height: 100vh;
        margin: auto;
        text-align: center;
        background: url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp), linear-gradient(45deg, #49a09d, #5f2c82);   /* Image */
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

    /* Position the button in the top-right corner */
    .btn.user-profile {
        position: absolute;
        top: 10px;      /* Distance from the top of the screen */
        right: 10px;    /* Distance from the right of the screen */
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 10px;
        color: #eaeaea;
        font-weight: bold;
    }

    .user-profile svg {
        color: #000; /* Set icon color */
        width: 24px; /* Icon size */
        height: 24px; /* Icon size */
        transition: color 0.3s;
    }

    /* Add hover effect */
    .user-profile:hover svg {
        color: #007bff; /* Change color on hover */
    }
</style>
