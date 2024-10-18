<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import Logout from './Logout.svelte';
    import { employees, fetchEmployees } from '../store';
    import EmployeesPagination from './EmployeesPagination.svelte';

    let error = '';

    const signUpNewEmployee = () => {
        navigate('/register');
    };

    const goToAdminDashboard = () => {
        navigate('/admin');
    };

    onMount(async () => {
        try {
            await fetchEmployees();
        } catch (err) {
            error = 'Failed to fetch employees. Please try again later.';
            console.error('Error fetching employees:', err);
        }
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
</div>
<Logout/>
<EmployeesPagination/>

<style>
    .employee-management {
        padding: 30px;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        max-width: 1200px;
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
        padding: 15px;
        text-align: left;
        font-size: 16px;
        font-weight: 600;
        color: #555;
        border-bottom: 2px solid #eaeaea;
    }

    .employee-table tbody {
        background-color: #ffffff;
    }

    .employee-table tbody tr {
        border-bottom: 1px dotted #ddd;
    }

    .employee-table tbody tr:last-child {
        border-bottom: none;
    }

    .employee-table tbody td {
        padding: 15px;
        font-size: 15px;
        color: #333;
    }

    .employee-table tbody tr:hover {
        background-color: #f1f1f1;
    }

    .button-container {
        display: flex;
        justify-content: center;
        margin-top: 20px;
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