<script>
    import { onMount } from 'svelte';
    import EditLeaveModal from './EditLeaveModal.svelte';
    import ApplyLeaveModal from './AppyLeaveModal.svelte';
    import Logout from '../authComponents/Logout.svelte';
    import { fetchLeaves } from '../../exportFunction';
    import ChangeStatus from '../basicComponents/ChangeStatus.svelte';
    import {leaveRequests} from '../../store'
    import Pagination from '../basicComponents/Pagination.svelte';
    import { navigate } from 'svelte-routing';

   
    let selectedLeaveRequest = null;
    let showEditModal = false;
    let showApplyModal = false;

    let currentPage = 1;  // Track the current page in the parent
    let limitValue = 10;   // Track the limit (items per page)

    let currentStatus = 'all'; // Holds the selected status filter (initialized to default value)


// This function is called whenever the 'pageChange' event is fired from the child. 
// It updates the currentPage in the parent to the new value passed from the child.
    const handlePageChange = (newPage) => {
        currentPage = newPage;
        fetchLeaves(currentPage, limitValue, currentStatus);  // Fetch data with the updated page
    };

// This function is called whenever the 'statusChange' event is fired from the child. 
// It updates the currentStatus in the parent to the new value passed from the child.
    const handleStatusChange = (newStatus) => {
        currentStatus = newStatus;
        currentPage = 1;
        fetchLeaves(currentPage, limitValue, currentStatus);  // Fetch data with the updated parameters
    };

//     const changeStatus = (currentstatus) => {
// // // This declares an arrow function, with status parameter, representing the status that user wants to filter
//         status.set(currentstatus);
// // // This line updates the currentStatus variable with the value passed as the status parameter. 
// // // This variable is used to keep track of which status filter is currently applied.
//         // currentPage = 1; // Reset to first page on status change
//         fetchLeaves(); // Filter leaves based on the new status
//     };

    const openEditModal = (leaveRequest) => {
        selectedLeaveRequest = leaveRequest;
// This line assigns the passed leaveRequest object to the selectedLeaveRequest variable. 
// This variable is used to store the specific leave request that the user has chosen to edit.
// By doing this, the modal can access the details of this leave request and populate the fields in the edit form.
        showEditModal = true;
// This line sets the showEditModal variable to true, indicating that the edit modal should be displayed to the user.
    };

    const closeEditModal = () => {
        showEditModal = false;
// This line sets the showEditModal variable to false, indicating that the edit modal should no longer be displayed.
        selectedLeaveRequest = null;
// This line resets the selectedLeaveRequest variable to null. 
// This is important for clearing the previously selected leave request and ensuring that when the modal is opened again, it doesn't display outdated or incorrect data.
        fetchLeaves(currentPage, limitValue, currentStatus);
    };

    const openApplyModal = () => {
        showApplyModal = true;
// This line sets the showApplyModal variable to true, indicating that the modal for applying for leave should be displayed to the user.
    };

    const closeApplyModal = () => {
        showApplyModal = false;
// This line sets the showApplyModal variable to false, indicating that the apply modal should no longer be displayed. 
        fetchLeaves(currentPage, limitValue, currentStatus);
// This line calls the fetchLeaveRequests function, which presumably retrieves the current list of leave requests from an API or data source.
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

    onMount(() => {
        const token = localStorage.getItem('token')
        if (!token)
        navigate ('/')
    else;
        fetchLeaves(currentPage, limitValue, currentStatus);
    });
</script>

<div class="dashboard">
    <h2>Employee Dashboard</h2>
    <div class="button-container">
<!-- This listens for the statusChange event from the child and invokes the handleStatusChange method in the parent, 
 which will update the parent's state (currentStatus). -->
  <!-- currentStatus={currentStatus} syntax, which binds the currentStatus state of the parent to the child component. -->
    <ChangeStatus
        currentStatus={currentStatus}
        on:statusChange={event => handleStatusChange(event.detail)} 
    />
        <button class="btn apply-leave" on:click={openApplyModal}>Apply for Leave</button>
        <!-- <div class="status-buttons">
            <button class="btn" on:click={() => changeStatus(null)}>All Leaves</button> -->
<!-- on:click={() => changeStatus('all')}: This specifies an event listener for the button's click event. When the button is clicked, the function changeStatus is called with the argument 'all'.
 The use of an arrow function here (() => changeStatus('all')) allows for passing the string 'all' as an argument when the button is clicked. -->
            <!-- <button class="btn" on:click={() => changeStatus('pending')}>Pending</button>
            <button class="btn" on:click={() => changeStatus('accepted')}>Accepted</button>
            <button class="btn" on:click={() => changeStatus('rejected')}>Rejected</button>
        </div> -->
    </div>

    <!-- <select bind:value={currentStatus} on:change={() => changeStatus(currentStatus)}>
        <option value="all">All</option>
        <option value="accepted">Accepted</option>
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
    </select> -->

    <table class="leave-table">
        <thead>
            <tr>
                <th>Leave From<br>(DD/MM/YYYY)</th>
                <th>Leave To<br>(DD/MM/YYYY)</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
                <th>Rejection Reason</th>
            </tr>
        </thead>
        <tbody>
            {#each $leaveRequests as leaveRequest}
<!-- This line uses the Svelte {#each} block to iterate over the filteredLeaves array, where each item is assigned to the variable leaveRequest. 
 This means that for each leave request in the array, a new table row (<tr>) will be created. -->
                <tr> 
                    <!-- Each leave request generates a new row in the table, containing multiple columns (<td>) -->
                    <td>{new Date(leaveRequest.leave_from).toLocaleDateString('en-GB')}</td>
                    <td>{new Date(leaveRequest.leave_to).toLocaleDateString('en-GB')}</td>
<!-- These two cells display the start and end dates of the leave request. The new Date(...).toLocaleDateString() method formats the date into a more readable format based on the user's locale settings. -->
                    <td>
                        <span class="truncated-reason" title={leaveRequest.reason}>
                            <!-- The title attribute on the <span> provides a tooltip with the full reason when hovered over. -->
                            {truncateReason(leaveRequest.reason, 5)}
                        </span>
                    </td>
                    <td>
                        <span class={leaveRequest.status === 'pending' ? 'status pending' : leaveRequest.status === 'accepted' ? 'status accepted' : 'status rejected'}>
<!--  The class of the <span> element is dynamically set based on the value of leaveRequest.status, applying different styles for 'pending', 'accepted', or 'rejected' statuses. -->
                            {leaveRequest.status}
                        </span>
                    </td>
                    <td>
                        {#if leaveRequest.status === 'pending'}
                            <button class="btn edit" on:click={() => openEditModal(leaveRequest)}>Edit</button>
                        {/if}
                    </td>
<!-- This cell conditionally renders an "Edit" button if the status of the leave request is 'pending'. 
 When clicked, it calls the openEditModal function, passing the current leaveRequest as an argument, allowing users to edit the pending request. -->
                    <td>{leaveRequest.rejectionReason}</td>
                </tr>
            {/each}
        </tbody>
    </table>

    {#if showEditModal}
<!-- This line uses Svelte's {#if} block to check whether the showEditModal variable is true. If it is, the content within this block will be rendered; otherwise, it will not be displayed.  -->
        <EditLeaveModal leaveRequest={selectedLeaveRequest} on:close={closeEditModal} />
<!-- Props: leaveRequest={selectedLeaveRequest}: This passes the currently selected leave request to the modal as a prop, allowing the modal to display and edit the details of that specific leave request.
 on:close={closeEditModal}: This sets up an event listener that calls the closeEditModal function when a close event is emitted from the EditLeaveModal -->
    {/if}

    {#if showApplyModal}
<!-- This line uses Svelte's {#if} block to check the value of the showApplyModal variable. If it is true, the content within this block will be rendered; otherwise, it will not be displayed.  -->
        <ApplyLeaveModal on:close={closeApplyModal} />
<!-- on:close={closeApplyModal}: This sets up an event listener for a close event emitted from the ApplyLeaveModal. -->
    {/if}

    <!-- This listens for the pageChange event from the child and invokes the handlePageChange method in the parent, 
 which will update the parent's state (currentPage). -->
 <!-- currentPage={currentPage} syntax, which binds the currentPage state of the parent to the child component. -->
<Pagination 
currentPage={currentPage} 
on:pageChange={event => handlePageChange(event.detail)}
/>
<Logout />
</div>

<style>
    .dashboard {
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        max-width: 90%;
        margin: auto;
        background: url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp), linear-gradient(45deg, #49a09d, #5f2c82);   /* Image */
        background-position: center; /* Position the image */
        background-size: cover /* Makes sure the background image covers the entire container */
    }

    h2 {
        font-family: 'Arial', sans-serif;
        margin-bottom: 15px;
        margin-top: -10px;
        color: #f9f9f9;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
    }

    .button-container {
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
        gap: 15px;
    }

    .btn.apply-leave {
        background-color: #28a745;
        padding: 12px 20px;  /*right left top bottom*/
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 13px;
        transition: background-color 0.3s ease, transform 0.3s;
        margin: 0 10px; /*right left top bottom*/
        width: 150px;
        color: white; /* Text color */
    }

    .btn.apply-leave:hover {
        background-color: #218838;
        transform: translateY(-2px);
    }

    .btn.edit {
        background-color: #007bff;
        border-radius: 5px;
        cursor: pointer;
        font-size: 13px;
        transition: background-color 0.3s ease, transform 0.3s;
        margin: 0 10px; /*right left top bottom*/
        width: 100px;
        color: white; /* Text color */
    }

    .btn.edit:hover {
        background-color: #0069d9;
        transform: translateY(-2px);
    }

    .leave-table {
        width: 100%;
/* This sets the table to occupy 100% of the width of its parent container, making it responsive to the available space. */
        border-collapse: collapse;
/* This property collapses the borders of the table cells into a single border, removing any space between them. It gives a cleaner look by preventing double borders. */
        box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
/* This adds a shadow effect below the table, creating depth.  */
        border-radius: 10px;
        overflow: hidden;
/* This ensures that any content that overflows the boundaries of the table (due to the rounded corners) is hidden, maintaining a clean appearance. */
    }

    .leave-table thead {
        background-color: #f5f6f9;
    }

    .leave-table thead th {
        padding: 8px;
        text-align: center;
        font-size: 13px;
        font-weight: bold;
        color: #555;
        border-bottom: 2px solid #eaeaea;
    }

    .leave-table tbody {
        background-color: #ffffff;
        background: beige;
    }

    .leave-table tbody tr {
        border-bottom: 1px dotted #ddd;
    }

    .leave-table tbody tr:last-child {
        border-bottom: none;
    }

    .leave-table tbody td {
        padding: 5px;
        font-size: 13px;
        color: #333;
        text-align: center;
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
        background-color: #FFA500; 
    }

    .status.accepted {
        background-color: #28a745; 
    }

    .status.rejected {
        background-color: #dc3545; 
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

</style>

