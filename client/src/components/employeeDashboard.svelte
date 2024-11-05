<script>
    import { onMount } from 'svelte';
    import EditLeaveModal from './EditLeaveModal.svelte';
    import ApplyLeaveModal from './AppyLeaveModal.svelte';
    import Logout from './Logout.svelte';
    import { fetchLeaves } from '../exportFunction';
    import EmployeeLeavesPagination from './EmployeeLeavesPagination.svelte';
    import {status, leaveRequests} from '../store'

   
    let selectedLeaveRequest = null;
    let showEditModal = false;
    let showApplyModal = false;

    let currentStatus = null; // Default status to show all leaves

    const changeStatus = (currentstatus) => {
// // This declares an arrow function, with status parameter, representing the status that user wants to filter
        status.set(currentstatus);
// // This line updates the currentStatus variable with the value passed as the status parameter. 
// // This variable is used to keep track of which status filter is currently applied.
        // currentPage = 1; // Reset to first page on status change
        fetchLeaves(); // Filter leaves based on the new status
    };

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
        fetchLeaves();
    };

    const openApplyModal = () => {
        showApplyModal = true;
// This line sets the showApplyModal variable to true, indicating that the modal for applying for leave should be displayed to the user.
    };

    const closeApplyModal = () => {
        showApplyModal = false;
// This line sets the showApplyModal variable to false, indicating that the apply modal should no longer be displayed. 
        fetchLeaves();
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
        fetchLeaves();
    });
</script>

<div class="dashboard">
    <h2>Employee Dashboard</h2>
    <div class="button-container">
        <button class="btn apply-leave" on:click={openApplyModal}>Apply for Leave</button>
        <div class="status-buttons">
            <button class="btn" on:click={() => changeStatus(null)}>All Leaves</button>
<!-- on:click={() => changeStatus('all')}: This specifies an event listener for the button's click event. When the button is clicked, the function changeStatus is called with the argument 'all'.
 The use of an arrow function here (() => changeStatus('all')) allows for passing the string 'all' as an argument when the button is clicked. -->
            <button class="btn" on:click={() => changeStatus('pending')}>Pending</button>
            <button class="btn" on:click={() => changeStatus('accepted')}>Accepted</button>
            <button class="btn" on:click={() => changeStatus('rejected')}>Rejected</button>
        </div>
    </div>

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
</div>
<EmployeeLeavesPagination/>
<Logout />
<style>
    .dashboard {
        padding: 30px;
        background-color: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        max-width: 1200px;
        margin: auto;
    }

    h2 {
        font-family: 'Arial', sans-serif;
        margin-bottom: 25px;
        color: #333;
        text-align: center;
        font-size: 24px;
    }

    .button-container {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

    .btn {
        padding: 12px 20px;  /*right left top bottom*/
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease, transform 0.3s;
        margin: 0 10px; /*right left top bottom*/
        width: 150px;
    }

    .btn.apply-leave {
        background-color: #28a745;
        color: white;
    }

    .btn.apply-leave:hover {
        background-color: #218838;
        transform: translateY(-2px);
    }

    .btn.edit {
        background-color: #007bff;
        color: white;
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
    background-color: #FFA500; 
}

.status.accepted {
    background-color: #28a745; 
}

.status.rejected {
    background-color: #dc3545; 
}

.truncated-reason {
        cursor: pointer;
/* converts the cursor to pointer type when it is hovered over */
        position: relative;
/* This is useful if you want to absolutely position child elements relative to this one */
        display: inline-block;
/* This allows the element to be treated as an inline element (allowing other inline elements to sit next to it) while still being able to set width, height, padding, and margin. */
    }

    .truncated-reason:hover::after {
/* targets the ::after pseudo-element of any element with the class truncated-reason when it is hovered over. */
        content: attr(title);
        position: absolute;
/* An element with position: absolute; is removed from the normal document flow. This means it does not affect the layout of surrounding elements, and those elements will behave as if the absolutely positioned element is not there. */
        left: 0;
        top: 100%;
        white-space: nowrap;
        background: #fff;
        border: 1px solid #ccc;
        padding: 5px;
        z-index: 10;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
/* /* .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
} */

.status-buttons {
    display: flex;
    gap: 15px;   /*Space between buttons  */
    margin-left: auto;  /* Align to the right */
}

.btn {
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease, transform 0.3s;
}

.btn:hover {
    transform: translateY(-2px); /* Lift effect on hover */
}

.btn {
    background-color: #007bff; /* Default button color */
    color: white; /* Text color */
}

</style>

