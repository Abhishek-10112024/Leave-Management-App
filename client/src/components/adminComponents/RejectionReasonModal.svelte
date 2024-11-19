<script>
    import { createEventDispatcher } from 'svelte';
    // This function allows the component to dispatch events that can be listened to by its parent components.
    import { navigate } from 'svelte-routing';
    //  This function is used to programmatically navigate to different routes in the application using svelte-routing.

    const dispatch = createEventDispatcher();
    // Initialize event dispatcher
    export let leave;

    let rejectionReason = leave.rejectionReason;
    let error = '';
    
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

            if (response.ok) {
                const data = await response.json();
                dispatch('close');
// 'close': This is a string that represents the name of the event being dispatched. In this case, it indicates that the modal should be closed.
// The name of the event can be anything you choose, depending on what you want to communicate. 
// Listening to Events: In the parent component, you would listen for the dispatched event like this: <Modal on:close={handleClose} />
// Here, handleClose would be a function defined in the parent component that executes whatever logic is needed when the modal closes, such as updating the UI or resetting state.
// Changing the event name does not automatically implement any specific behavior. The logic to close the modal must be defined in the event handler in the parent component. 
// If the parent does not listen for the dispatched event, nothing will happen when the event is dispatched.
                navigate('/leave-management');
            } else {
                const { message } = await response.json();
                error = message || 'Error while rejecting for leave';
            }
        } catch (err) {
            console.error('Error rejecting leave request:', err);
            error = 'Error while rejecting leave';
        }
    };

    const closeModal = () => {
        dispatch('close');
// This function is called when the user clicks the "Cancel" button, dispatching a 'close' event to inform the parent component to close the modal.
    };
</script>

<div class="modal">
    <div class="modal-content">
        <h2>Rejection Reason</h2>
        <textarea bind:value={rejectionReason} placeholder="Reason for rejecting leave" required></textarea>
<!-- <textarea>: This element creates a multi-line text input field. 
 Unlike the <input> element, which is typically used for single-line inputs, the <textarea> is designed to accept larger blocks of text. -->
        {#if error}
            <p class="error">{error}</p>
        {/if}
        <div class="button-container">
            {#if leave.rejectionReason === 'in process' && leave.status === 'pending'}
                                <button class="submit-btn" on:click={() => updateLeaveStatus(leave.leave_id, 'rejected', rejectionReason)}>Reject</button>
                                <button class="cancel-btn" on:click={closeModal}>Cancel</button>
            {/if}
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
        color: #333;
        font-size: 24px;
    }

    textarea {
        resize: vertical;
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
