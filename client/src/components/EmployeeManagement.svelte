<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import Logout from './Logout.svelte';
    import {employees, fetchEmployees} from '../store';
    import EmployeesPagination from './EmployeesPagination.svelte';

    let userRole = localStorage.getItem('userRole') || 'Employee';
    let error = '';

    const signUpNewEmployee = () => {
        navigate('/register');
    };

    const goToAdminDashboard = () => {
        navigate('/admin');
    };
    onMount(fetchEmployees);
</script>

<div class="employee-management">
    <h1>Employee Management</h1>
    {#if error}
        <p class="error">{error}</p>
    {/if}

    <table>
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
        <button on:click={signUpNewEmployee}>Sign Up New Employee</button>
        <button on:click={goToAdminDashboard}>Back to Admin Dashboard</button>
    </div>
</div>
<Logout/>
<EmployeesPagination/>
<style>
    .employee-management {
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
