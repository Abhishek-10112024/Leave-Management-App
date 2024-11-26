<script>
    import { navigate } from 'svelte-routing';
    import Logout from '../authComponents/Logout.svelte';
    import { beforeUpdate, onMount } from 'svelte';
    import ProfileModal from '../basicComponents/ProfileModal.svelte';
    import ApplyLeaveModal from '../employeeComponents/AppyLeaveModal.svelte';
    import EditLeaveModal from '../employeeComponents/EditLeaveModal.svelte';
    import { fetchLeaves } from '../../exportFunction';
    import ChangeStatus from '../basicComponents/ChangeStatus.svelte';
    import {leaveRequests} from '../../store'
    import Pagination from '../basicComponents/Pagination.svelte';
    import { jwtDecode } from 'jwt-decode';


    let showprofileModal = false;
    let selectedLeaveRequest = null;
    let showEditModal = false;
    let showApplyModal = false;

    let currentPage = 1;  // Track the current page in the parent
    let limitValue = 10;   // Track the limit (items per page)

    let currentStatus = 'all'; // Holds the selected status filter (initialized to default value)

    let token = localStorage.getItem('token');
    let username = null;
    const decodedToken = jwtDecode(token);
    // @ts-ignore
    username = decodedToken.name;

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

    const truncateReason = (reason, limit = 20) => {
    // This line takes the first `limit` characters from the reason string.
        return reason.length > limit ? reason.slice(0, limit) + '...' : reason;
    };

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
    else;
        fetchLeaves(currentPage, limitValue, currentStatus);
    });
</script>

<div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <div class="button-container">
        <button on:click={goToLeaveManagement}>Manage Leave Requests</button>
        <button on:click={goToEmployeeManagement}>Manage Employees</button>
        <ChangeStatus
        currentStatus={currentStatus}
        on:statusChange={event => handleStatusChange(event.detail)} 
    />
        <button class="btn apply-leave" on:click={openApplyModal}>Apply for Leave</button>
    </div>

    <div>
        <button class="btn user-profile" on:click={openprofileModal}>Hello, {username}
            <!-- Person Icon SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg>
        </button>
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
            {#each $leaveRequests as leaveRequest (leaveRequest.leave_id)}
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
                            {truncateReason(leaveRequest.reason)}
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

    {#if showprofileModal}
<!-- This line uses Svelte's {#if} block to check the value of the showApplyModal variable. If it is true, the content within this block will be rendered; otherwise, it will not be displayed.  -->
        <ProfileModal on:close={closeprofileModal} />
<!-- on:close={closeApplyModal}: This sets up an event listener for a close event emitted from the ApplyLeaveModal. -->
    {/if}

    <Pagination 
    currentPage={currentPage} 
    on:pageChange={event => handlePageChange(event.detail)}
    />
    
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
        margin-top: -5px;
        margin-bottom: -5px;
    }

    .btn.edit:hover {
        background-color: #0069d9;
        transform: translateY(-2px);
    }

    .leave-table {
        margin-top: 10px;
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

    .logout{
        position: absolute;
        bottom: 10px; /* Distance from the bottom of the page */
        left: 45%;
    }
</style>
