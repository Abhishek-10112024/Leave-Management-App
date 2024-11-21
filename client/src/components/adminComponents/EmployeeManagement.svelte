<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import Logout from '../authComponents/Logout.svelte';
    import { employees } from '../../store';
    import { fetchEmployees } from '../../exportFunction';
    import Pagination from '../basicComponents/Pagination.svelte';

    let error = '';
    let currentPage = 1;  // Track the current page in the parent
    let limitValue = 10;   // Track the limit (items per page)

    const signUpNewEmployee = () => {
        navigate('/register');
    };

    const goToAdminDashboard = () => {
        navigate('/admin');
    };

// This function is called whenever the 'pageChange' event is fired from the child. 
// It updates the currentPage in the parent to the new value passed from the child.
        const handlePageChange = (newPage) => {
        currentPage = newPage;
        fetchEmployees(currentPage, limitValue);  // Fetch data with the updated page
    };

    onMount(() => {
        const token = localStorage.getItem('token')
        if (!token)
        navigate('/')
    else;
        fetchEmployees(currentPage, limitValue);
    });
</script>

<div class="employee-management">
    <h1>Employee Management</h1>
    {#if error}
        <p class="error">{error}</p>
    {/if}

    <table class="employee-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Total Leaves</th>
                <th>Remaining Leaves</th>
            </tr>
        </thead>
        <tbody>
            {#each $employees as employee}
                <tr>
                    <td>{employee.e_id}</td>
                    <td>{employee.e_name}</td>
                    <td>{employee.e_email}</td>
                    <td>{employee.e_dept}</td>
                    <td>{employee.e_role}</td>
                    <td>{employee.total_leaves}</td>
                    <td>{employee.remaining_leaves}</td>
                </tr>
            {/each}
        </tbody>
    </table>

    <div class="button-container">
        <button class="btn sign-up" on:click={signUpNewEmployee}>Sign Up New Employee</button>
        <button class="btn dashboard" on:click={goToAdminDashboard}>Back to Admin Dashboard</button>
    </div>
    
    <!-- This listens for the pageChange event from the child and invokes the handlePageChange method in the parent, 
     which will update the parent's state (currentPage). -->
    <Pagination 
        on:pageChange={event => handlePageChange(event.detail)}
    />
    <Logout/>
</div>

<style>
    .employee-management {
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        max-width: 90%;
        margin: auto;
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
        font-size: 22px;
        font-weight: bold;
    }

    .error {
        color: red;
        margin-bottom: 20px;
        text-align: center;
    }

    .employee-table {
        width: 100%;
        border-collapse: collapse;
        box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        overflow: hidden;
    }

    .employee-table thead{
        background-color: #f5f6f9;
    }

    .employee-table thead th{
        padding: 8px;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        color: #555;
        border-bottom: 2px solid #eaeaea;
    }

    .employee-table tbody {
        background-color: #ffffff;
        background: beige;
    }

    .employee-table tbody tr {
        border-bottom: 1px dotted #ddd;
    }

    .employee-table tbody tr:last-child {
        border-bottom: none;
    }

    .employee-table tbody td {
        padding: 6px;
        font-size: 13px;
        color: #333;
        text-align: center;
    }

    .employee-table tbody tr:hover {
        background-color: #f1f1f1;
    }

    .button-container {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }

    .btn {
        padding: 12px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 13px;
        transition: background-color 0.3s ease, transform 0.3s;
        margin: 1px 10px;
        width: 20%;
    }

    .btn.sign-up {
        background-color: #28a745;
        color: white;
    }

    .btn.sign-up:hover {
        background-color: #218838;
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
</style>