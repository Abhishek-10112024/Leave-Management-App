<script>
    import { onMount } from "svelte";
    import { createEventDispatcher } from 'svelte';
        // This function allows the component to dispatch events that can be listened to by its parent components.
    import { navigate } from 'svelte-routing';
    //  This function is used to programmatically navigate to different routes in the application using svelte-routing.

    const dispatch = createEventDispatcher();
    // Initialize event dispatcher
    let profile = {};


    const getProfile = async () => {
    try {

        // const currentPage = get(page);
        // const itemsPerPage = get(limit);
        // const currentStatus = get(status);
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch('http://localhost:3000/api/employees/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            profile = data.profile;
        } else {
            console.error('Failed to fetch profile');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};
    const closeModal = () => {
        dispatch('close')
// This function is called when the user clicks the "Close" button, dispatching a 'close' event to inform the parent component to close the modal.
    };

    onMount(() => {
        const token = localStorage.getItem('token')
        if (!token)
        navigate ('/')
    else;
        getProfile();
    });
</script>

<div class="modal">
    <div class="modal-content">
        <h2>{profile.e_name}</h2>
        <table class="employee-table">
            <tbody>
                <tr>
                    <td>ID</td>
                    <td>{profile.e_id}</td>
                </tr>
                <tr>
                    <td>Name</td>
                    <td>{profile.e_name}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{profile.e_email}</td>
                </tr>
                <tr>
                    <td>Department</td>
                    <td>{profile.e_dept}</td>
                </tr>
                <tr>
                    <td>Role</td>
                    <td>{profile.e_role}</td>
                </tr>
                <tr>
                    <td>Total Leaves</td>
                    <td>{profile.total_leaves}</td>
                </tr>
                <tr>
                    <td>Reamaining Leaves</td>
                    <td>{profile.remaining_leaves}</td>
                </tr>
            </tbody>
        </table>

        <div class="button-container">
            <button class="btn1" on:click={closeModal}>Close</button>
        </div>
    </div>
</div>

<style>
    .modal {
        position: fixed;
/* This positions the modal relative to the viewport, meaning it stays in the same position even when the page is scrolled. */
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
/* These properties set the modal to stretch from the top, left, right, and bottom edges of the viewport, effectively covering the entire screen. */
        background-color: rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: center;
/* This centers the flex items (modal content) horizontally within the modal. */
        align-items: center;
/* This centers the flex items vertically within the modal */
        z-index: 1000;
/* This sets the stacking order of the modal. A higher z-index ensures that the modal appears above other elements on the page. */
    }

    .modal-content {
        background-color: #fff;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        max-width: 30%;
        text-align: center;
        animation: fadeIn 0.3s;
        background: url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp), linear-gradient(45deg, #49a09d, #5f2c82);   /* Image */
        background-position: center; /* Position the image */
        background-size: cover /* Makes sure the background image covers the entire container */
/* Applies the fadeIn animation to the modal content, allowing it to smoothly appear over 0.3 seconds when the modal is displayed. */
    }

    @keyframes fadeIn {
/* The @keyframes fadeIn animation defined creates a fade-in effect combined with a slight upward movement. */
/* The element starts completely transparent. The element starts 10 pixels higher than its final position. */
/* The element ends fully visible. The element ends at its original position. */
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    h2 {
        margin-bottom: 20px;
        color: #f9f9f9;
        font-size: 24px;
    }

    .employee-table {
        width: 100%;
        border-collapse: collapse;
        box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        overflow: hidden;
    }

    .employee-table tbody {
        background-color: #ffffff;
        background: beige;
    }

    .employee-table tbody tr {
        border-bottom: 1px dotted #ddd;
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
    .btn1 {
      width: 100px; /* Increased width for better visibility */
      padding: 5px; /* Padding for a larger clickable area */
      background: linear-gradient(45deg, #007bff, #0056b3); /* Gradient background */
      color: white; /* White text color */
      border: none; /* Remove default border */
      border-radius: 8px; /* More rounded corners for a modern look */
      font-size: 13px; /* Font size for the text */
      cursor: pointer; /* Pointer cursor on hover */
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow for depth */
      transition: background 0.3s, transform 0.3s; /* Smooth transition for background and scale */
      outline: none; /* Remove default focus outline */
    }
  
    .btn1:hover {
      background: linear-gradient(45deg, #0056b3, #003d7a); /* Darker gradient on hover */
      transform: scale(1.05); /* Slightly enlarge on hover */
    }
  
    .btn1:active {
      transform: scale(0.98); /* Slightly shrink on click */
    }
  
    .btn1:focus {
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5); /* Focus outline for accessibility */
    }
</style>
