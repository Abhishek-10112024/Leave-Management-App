<script>
    import { createEventDispatcher } from 'svelte';
    // This function allows the component to dispatch events that can be listened to by its parent components.
    import { navigate } from 'svelte-routing';
    //  This function is used to programmatically navigate to different routes in the application using svelte-routing.

    const dispatch = createEventDispatcher();
    // Initialize event dispatcher
    
    let leave_from = '';
    let leave_to = '';
    let reason = '';
    let error = '';
    
    const applyLeave = async () => { // asynchronous function declaration
        try {
            const response = await fetch('http://localhost:3000/api/employees/leaves', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Includes a bearer token from local storage for authentication.
                },
                body: JSON.stringify({ leave_from, leave_to, reason }),
                credentials: 'include' // allowing metadata to be sent in header
            });

            if (response.ok) {
                const data = await response.json();
                alert('Leave request submitted successfully!');
                dispatch('close');
// 'close': This is a string that represents the name of the event being dispatched. In this case, it indicates that the modal should be closed.
// The name of the event can be anything you choose, depending on what you want to communicate. 
// Listening to Events: In the parent component, you would listen for the dispatched event like this: <Modal on:close={handleClose} />
// Here, handleClose would be a function defined in the parent component that executes whatever logic is needed when the modal closes, such as updating the UI or resetting state.
// Changing the event name does not automatically implement any specific behavior. The logic to close the modal must be defined in the event handler in the parent component. 
// If the parent does not listen for the dispatched event, nothing will happen when the event is dispatched.
                navigate('/employee');
            } else {
                const { message } = await response.json();
                error = message || 'Error while applying for leave';
            }
        } catch (err) {
            console.error('Error submitting leave request:', err);
            error = 'Error while applying for leave';
        }
    };

    const closeModal = () => {
        dispatch('close');
// This function is called when the user clicks the "Cancel" button, dispatching a 'close' event to inform the parent component to close the modal.
    };
</script>

<div class="modal">
    <div class="modal-content">
        <h2>Apply for Leave</h2>
        <input type="date" placeholder="Leave From" bind:value={leave_from} required/>
<!-- Binding: This is a Svelte feature that binds the value of the input directly to the leave_from variable in the component's state.
 Two-way Data Binding: If the user selects a date, leave_from will automatically update to reflect that date. 
 Conversely, if leave_from is updated programmatically, the input field will also reflect that change. -->
 <!-- Required: This attribute indicates that the field must be filled out before the form can be submitted. 
  If the user tries to submit the form without selecting a date, the browser will typically display a validation message. -->
        <input type="date" bind:value={leave_to} required />
        <textarea bind:value={reason} placeholder="Reason for leave" required></textarea>
<!-- <textarea>: This element creates a multi-line text input field. 
 Unlike the <input> element, which is typically used for single-line inputs, the <textarea> is designed to accept larger blocks of text. -->
        {#if error}
            <p class="error">{error}</p>
        {/if}
        <div class="button-container">
            <button class="submit-btn" on:click={applyLeave}>Submit Leave Request</button>
            <button class="cancel-btn" on:click={closeModal}>Cancel</button>
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
        background-color: rgba(0, 0, 0, 0.7);
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
        width: 90%;
        max-width: 450px;
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

    /* This CSS selector targets two types of form elements and applies a common style to both of them: <input type="date"> and <textarea>. */
    input[type="date"],
    textarea {
        width: 100%;
        padding: 12px;
        margin: 10px 0;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 16px;
        transition: border-color 0.3s;
    }

    /* This CSS rule targets the <input type="date"> and <textarea> elements when they are focused (i.e., when the user clicks into them or navigates to them using the keyboard). */
    input[type="date"]:focus,
    textarea:focus {
        border-color: #4CAF50;
        outline: none;
    }

    textarea {
        resize: vertical; 
        /* when the content is more than the current box size, then we can increase the text area using the cursor */
        height: 100px;
    }

    .error {
        color: #dc3545;
        font-size: 14px;
        margin-top: 10px;
    }

    .button-container {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    /* applies same styling for both submit and cancle button, by selecting the class of both buttons using a comma */
    .submit-btn,
    .cancel-btn {
        padding: 12px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: background-color 0.3s ease, transform 0.3s;
        flex: 1;
/* The flex: 1; property in CSS is a shorthand for defining how a flex item grows and shrinks within a flex container. 
flex-grow: 1; This allows the flex item to grow and take up any available space in the flex container. If there are multiple items with flex-grow set to 1, they will distribute the available space equally.
flex-shrink: 1; This allows the flex item to shrink if necessary when the flex container is smaller than the total width of its items. If there are multiple items, they will shrink proportionally.
flex-basis: 0; This sets the initial size of the flex item before any available space is distributed. In this case, it defaults to 0, meaning the item starts with no intrinsic size.*/
        margin: 0 5px;
    }

    .submit-btn {
        background-color: #4CAF50;
        color: white;
    }

    .submit-btn:hover {
        background-color: #45a049;
        transform: translateY(-2px);
    }

    .cancel-btn {
        background-color: #f44336;
        color: white;
    }

    .cancel-btn:hover {
        background-color: #e53935;
        transform: translateY(-2px);
    }
</style>
