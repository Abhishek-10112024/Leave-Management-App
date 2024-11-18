<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import {leaves} from '../../store';
    import { fetchLeaveRequests } from '../../exportFunction';
    import Logout from '../authComponents/Logout.svelte';
    import RejectionReasonModal from './RejectionReasonModal.svelte';
    import ChangeStatus from '../basicComponents/ChangeStatus.svelte';
    import Pagination from '../basicComponents/Pagination.svelte';

    let error = '';
    let showRejectionModal = false;
    let selectedLeave = null;

    let currentPage = 1;  // Track the current page in the parent
    let limitValue = 10;   // Track the limit (items per page)

    // const options = ['all', 'pending', 'accepted', 'rejected']; // The filter options for the dropdown, will be useful if I am using the each block to loop through this array, rather than setting the options manually.
    let currentStatus = 'all';

    const updateLeaveStatus = async (leave_id, status, rejectionReason) => {
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

            await fetchLeaveRequests(currentPage, limitValue, currentStatus);
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

// This function is called whenever the 'pageChange' event is fired from the child. 
// It updates the currentPage in the parent to the new value passed from the child.
    const handlePageChange = (newPage) => {
        currentPage = newPage;
        fetchLeaveRequests(currentPage, limitValue, currentStatus);  // Fetch data with the updated page
    };

//     const changeStatus = (currentstatus) => {
// // // This declares an arrow function, with status parameter, representing the status that user wants to filter
//         status.set(currentstatus);
// // // This line updates the currentStatus variable with the value passed as the status parameter. 
// // // This variable is used to keep track of which status filter is currently applied.
//         // currentPage = 1; // Reset to first page on status change
//         fetchLeaveRequests(); // Filter leaves based on the new status
//     };

    // Function to call when status changes
    const handleStatusChange = (newStatus) => {
        currentStatus = newStatus;
        currentPage = 1;  // reset the page to 1 on change in status
        fetchLeaveRequests(currentPage, limitValue, currentStatus);  // Fetch data with the updated status
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

    const openRejectionModal = (leave) => {
        selectedLeave = leave;
// This line assigns the passed leaveRequest object to the selectedLeaveRequest variable. 
// This variable is used to store the specific leave request that the user has chosen to edit.
// By doing this, the modal can access the details of this leave request and populate the fields in the edit form.
        showRejectionModal = true;
// This line sets the showEditModal variable to true, indicating that the edit modal should be displayed to the user.
    };

    const closeRejectionModal = () => {
        showRejectionModal = false;
// This line sets the showEditModal variable to false, indicating that the edit modal should no longer be displayed.
        selectedLeave = null;
// This line resets the selectedLeaveRequest variable to null. 
// This is important for clearing the previously selected leave request and ensuring that when the modal is opened again, it doesn't display outdated or incorrect data.
        fetchLeaveRequests(currentPage, limitValue, currentStatus);
    };

    // onMount(fetchLeaveRequests);
    onMount(() => {
        const token = localStorage.getItem('token')
        if (!token)
        navigate('/')
    else;
        fetchLeaveRequests(currentPage, limitValue, currentStatus);
    });
</script>

<div class="leave-management">
    <h1>Leave Management</h1>
    {#if error}
        <p class="error">{error}</p>
    {/if}
    <!-- <div class="status-buttons">
        <button class="btn" on:click={() => changeStatus(null)}>All Leaves</button> -->
      <!-- on:click={() => changeStatus('all')}: This specifies an event listener for the button's click event. When the button is clicked, the function changeStatus is called with the argument 'all'.
      The use of an arrow function here (() => changeStatus('all')) allows for passing the string 'all' as an argument when the button is clicked. -->
        <!-- <button class="btn" on:click={() => changeStatus('pending')}>Pending</button>
        <button class="btn" on:click={() => changeStatus('accepted')}>Accepted</button>
        <button class="btn" on:click={() => changeStatus('rejected')}>Rejected</button>
      </div> -->

      <!-- <select bind:value={currentStatus} on:change={() => changeStatus(currentStatus)}> -->
        <!-- {#each options as option} This is a Svelte {#each} block that loops over an array of options. options:an array of possible status values that the user can choose from || option:For each item in the options array, a new <option> element will be created, with the value of option as its value and its text displayed in the dropdown. -->
          <!-- <option value={option}>{option}</option> value={option}: This binds the value of the <option> element to the value of option from the options array. || {option}: This is the display text of the <option>. It will show the value of the option as the option label in the dropdown. -->
        <!-- {/each}
      </select> -->

      <!-- <select bind:value={currentStatus} on:change={() => changeStatus(currentStatus)}>
        <option value="all">All</option>
        <option value="accepted">Accepted</option>
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
      </select> -->

      <div class="button-container">
<!-- This listens for the statusChange event from the child and invokes the handleStatusChange method in the parent, 
 which will update the parent's state (currentStatus). -->
 <!-- currentStatus={currentStatus} syntax, which binds the currentStatus state of the parent to the child component. -->
        <ChangeStatus
            currentStatus={currentStatus}
            on:statusChange={event => handleStatusChange(event.detail)} 
        />
        <button class="btn dashboard" on:click={goToAdminDashboard}>Back to Admin Dashboard</button>
        </div>

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
                            {#if leave.rejectionReason === 'in process' && leave.status === 'pending'}
                                <button class="btn accept" on:click={() => updateLeaveStatus(leave.leave_id, 'accepted', 'Granted')}>Accept</button>
                                <button class="btn reject" on:click={() => openRejectionModal(leave)}>Reject</button>
                            {/if}
                        </div>
                    </td>
                    <td>
                        {leave.rejectionReason}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>

    {#if showRejectionModal}
    <!-- This line uses Svelte's {#if} block to check whether the showEditModal variable is true. If it is, the content within this block will be rendered; otherwise, it will not be displayed.  -->
            <RejectionReasonModal leave={selectedLeave} on:close={closeRejectionModal} />
    <!-- Props: leaveRequest={selectedLeaveRequest}: This passes the currently selected leave request to the modal as a prop, allowing the modal to display and edit the details of that specific leave request.
     on:close={closeEditModal}: This sets up an event listener that calls the closeEditModal function when a close event is emitted from the EditLeaveModal -->
        {/if}
</div>
<!-- <LeavesPagination/> -->
 <!-- This listens for the pageChange event from the child and invokes the handlePageChange method in the parent, 
 which will update the parent's state (currentPage). -->
 <!-- currentPage={currentPage} syntax, which binds the currentPage state of the parent to the child component. -->
<Pagination 
    currentPage={currentPage} 
    on:pageChange={event => handlePageChange(event.detail)}
/>
<Logout/>

<style>
    .leave-management {
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        max-width: 90%;
        margin: auto;
    }

    h1 {
        font-family: 'Arial', sans-serif;
        margin-bottom: none;
        margin-top: -10px;
        color: #333;
        text-align: center;
        font-size: 22px;
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
        font-size: 13px;
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
        padding: 8px;
        font-size: 13px;
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
        margin-top: 10px;
        margin-bottom: 10px;
        gap: 15px;
    }

    .action-buttons {
        display: flex; 
        gap: 10px; 
    }

    .btn {
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 13px;
        transition: background-color 0.3s ease, transform 0.3s;
        background-color: #007bff; /* Default button color */
        color: white; /* Text color */
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
    /* .truncated-reason class styles the element that will show the tooltip */
    .truncated-reason {
        cursor: pointer; /* Changes the cursor to a pointer (hand) when hovering over the element, indicating it's interactive */
        position: relative; /* Positions the element relative to its normal position, enabling positioning of the pseudo-element (::after) */
        display: inline-block; /* Makes the element behave like an inline element but also allows block-level styling (padding, width, etc.) */
    }

    /* Hover state for the .truncated-reason element */
    /* .truncated-reason:hover::after { */
        /* content: attr(title); Uses the value of the 'title' attribute as the content for the tooltip */
        /* position: absolute; Absolutely positions the tooltip relative to the .truncated-reason element */
        /* left: 0; Aligns the tooltip's left edge with the left edge of the parent element */
        /* top: 100%; Positions the tooltip just below the .truncated-reason element (100% means the bottom of the parent) */
        
        /* white-space: nowrap; Prevents the tooltip text from wrapping onto multiple lines, keeping it in a single line */
        
        /* background: #fff; Sets the background color of the tooltip to white */
        /* border: 1px solid #ccc; Adds a light gray border around the tooltip */
        /* padding: 5px; Adds padding inside the tooltip to provide space around the text */
        
        /* z-index: 10; Ensures the tooltip appears above other elements on the page (higher z-index means it sits on top) */
        
        /* Adds a subtle shadow to the tooltip, making it appear lifted off the page */
        /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); */
        /* The shadow is 2px vertically offset, with a 10px blur, and a semi-transparent black color (20% opacity) */
    /* } */
    .status-buttons {
    display: flex;
    gap: 15px;   /*Space between buttons  */
    margin-bottom: 5px;
    margin-left: 400px;
    }

    .btn:hover {
        transform: translateY(-2px); /* Lift effect on hover */
    }
</style>