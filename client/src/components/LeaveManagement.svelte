<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import {leaves} from '../store';
    import { fetchLeaveRequests } from '../exportFunction';
    import Logout from './Logout.svelte';
    import LeavesPagination from './LeavesPagination.svelte';

    let error = '';
    let rejectionReason = '';

    const updateLeaveStatus = async (leave_id, status) => {
        try {
            const response = await fetch(`http://localhost:3000/api/leaves/${leave_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status, rejectionReason })
            });

            if (!response.ok) {
                const { message } = await response.json();
                throw new Error(message);
                // throw does not automatically display an error as an alert or in a paragraph on the webpage. 
                // Instead, when you use throw new Error(message);, it raises an exception in your code that can be caught and handled with a try...catch block.
            }

            await fetchLeaveRequests();
            alert(`Leave request ${status === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
            // sends an window alert based on the status, if accepted or rejected
        } catch (err) {
            error = err.message;
            console.error('Error updating leave status:', error);
        }
    };

    const goToAdminDashboard = () => {
        navigate('/admin');
    };

    const truncateReason = (reason, limit) => {
// This line defines an arrow function named truncateReason, which takes two parameters: reason: A string containing the text that needs to be truncated. & limit: A number specifying the maximum number of words to retain in the truncated result.
        const formattedReason = reason.replace(/(.{20})/g, '$1 ');
// This line uses a regular expression to format the reason string by adding a space after every 20 characters. 
// This ensures that when the text is split into words, it does not break in the middle of a word.
// /(.{20})/g: Matches any sequence of 20 characters.
// '$1 ': Replaces the matched sequence with the same characters followed by a space.
        const words = formattedReason.split(' ');
// This line splits the formattedReason string into an array of words using space as the delimiter.
        return words.slice(0, limit).join(' ') + (words.length > limit ? '...' : '');
// words.slice(0, limit): This takes the first limit words from the words array.
// .join(' '): This combines the sliced words back into a single string, separated by spaces.
// (words.length > limit ? '...' : ''): This appends an ellipsis (...) if the original reason had more words than the specified limit, indicating that the text has been truncated.
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
                <th>Leave From<br>(DD/MM/YYYY)</th>
                <th>Leave To<br>(DD/MM/YYYY)</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
                <th>Rejection Reason</th>
            </tr>
        </thead>
        <tbody>
            {#each $leaves as leave}
                <tr>
                    <td>{leave.leave_id}</td>
                    <td>{leave.e_id}</td>
                    <td>{leave.e_name}</td>
                    <td>{new Date(leave.leave_from).toLocaleDateString('en-GB')}</td>
<!-- The .toLocaleDateString() method in JavaScript is used to convert a Date object into a string, formatted according to the conventions of a specific locale.render
 date.toLocaleDateString(): // Default locale format
 date.toLocaleDateString('en-US'): // US format: MM/DD/YYYY
 date.toLocaleDateString('en-GB'): // UK format: DD/MM/YYYY
 date.toLocaleDateString('fr-FR'): // French format: DD/MM/YYYY 
 // Using options
console.log(date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
// Output: October 28, 2024 -->
                    <td>{new Date(leave.leave_to).toLocaleDateString('en-GB')}</td>
                    <td>
                        <span class="truncated-reason" title={leave.reason}>
<!-- The <span> tag is used to wrap the truncated reason text. It’s an inline element that allows you to apply CSS styles or attributes without affecting the layout of the table cell.
 The title attribute is set to the full reason text. When users hover over the <span>, they will see a tooltip displaying the complete reason.  -->
                            {truncateReason(leave.reason, 5)}
<!-- This is a call to a function named truncateReason. It takes two parameters: the full reason text (leave.reason) and a limit (5), indicating the maximum number of words to display. 
 The function will return a truncated version of the reason, ensuring that only the first five words are shown in the table cell. 
 If the reason has more than five words, it typically appends an ellipsis (...) to indicate that the text has been cut off. -->
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
                    <td>{leave.rejectionReason}</td>
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
        padding: 5px;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        margin: auto;
        width: 100%;
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
/* The CSS selector .leave-table thead th targets all <th> (table header) elements that are inside a <thead> (table header section) within any element that has the class .leave-table. */
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
/* targets the last <tr> (table row) element within the <tbody> section of any element that has the class .leave-table. */
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
        /* targets any HTML element that has both the class status and the class pending. */
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
/* white-space: nowrap; is used to control how whitespace inside an element is handled.
nowrap, it prevents the text from wrapping onto the next line. */
        background: #fff;
        border: 1px solid #ccc;
        padding: 5px;
        z-index: 10;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
</style>