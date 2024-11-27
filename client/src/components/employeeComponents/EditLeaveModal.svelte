<script>
    import { createEventDispatcher } from 'svelte';
    
    export let leaveRequest;
// Exported Variable: leaveRequest is exported, which allows it to be passed from a parent component.
// The child component receives the leaveRequest prop, which contains the details of the leave request to be edited (e.g., leave_from, leave_to, reason).
    const dispatch = createEventDispatcher();
// createEventDispatcher() is used to send events from the component, typically to notify the parent about changes or actions.

    let leave_from = leaveRequest.leave_from;
    let leave_to = leaveRequest.leave_to;
    let reason = leaveRequest.reason;
    let error = '';

    const updateLeave = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/employee/leaves/${leaveRequest.leave_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ leave_from, leave_to, reason }),
                credentials: 'include'
            });

            if (response.ok) {
                alert('Leave request updated successfully!');
                dispatch('close');
            } else {
                const { message } = await response.json();
                error = message || 'Error while updating leave request';
            }
        } catch (err) {
            console.error('Error updating leave request:', err);
            error = 'Error while updating leave request';
        }
    };

    const deleteLeave = async () => {
        const confirmDelete = confirm("Are you sure you want to delete this leave request?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/api/employee/leaves/${leaveRequest.leave_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include'
            });

            if (response.ok) {
                alert('Leave request deleted successfully!');
                dispatch('close');
            } else {
                const { message } = await response.json();
                error = message || 'Error while deleting leave request';
            }
        } catch (err) {
            console.error('Error deleting leave request:', err);
            error = 'Error while deleting leave request';
        }
    };

    const closeModal = () => {
        dispatch('close');
    };
</script>

<div class="modal">
    <div class="modal-content">
        <h2>Edit Leave Request</h2>
        <input type="date" bind:value={leave_from} required placeholder="Leave From" />
        <input type="date" bind:value={leave_to} required placeholder="Leave To" />
        <textarea bind:value={reason} placeholder="Reason for leave" required></textarea>
        {#if error}
            <p class="error">{error}</p>
        {/if}
        <div class="button-container">
            <button class="update-btn" on:click={updateLeave}>Update Leave Request</button>
            <button class="delete-btn" on:click={deleteLeave}>Delete Leave Request</button>
            <button class="cancel-btn" on:click={closeModal}>Cancel</button>
        </div>
    </div>
</div>

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
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
    }

    @keyframes fadeIn {
/* The @keyframes fadeIn animation defined creates a fade-in effect combined with a slight upward movement. */
        from { opacity: 0; transform: translateY(-10px); }
/* The element starts completely transparent. The element starts 10 pixels higher than its final position. */
        to { opacity: 1; transform: translateY(0); }
/* The element ends fully visible. The element ends at its original position. */
    }

    h2 {
        margin-bottom: 20px;
        color: #f9f9f9;
        font-size: 24px;
    }

    input[type="date"],
    textarea {
/* targets two specific types of elements: 
targets all <input> elements that have a type attribute set to "date"
targets all <textarea> elements, which are used for multi-line text input. */
        width: 100%;
        padding: 12px;
        margin: 10px 0;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 16px;
        transition: border-color 0.3s;
    }

    input[type="date"]:focus,
    textarea:focus {
/* targets specific form elements when they are focused (i.e., when the user clicks on them or navigates to them using the keyboard)
Targets <input> elements with a type of "date" that are currently focused.
Targets <textarea> elements that are currently focused. */
        border-color: #4CAF50;
        outline: none;
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

    .update-btn,
    .delete-btn,
    .cancel-btn {
        padding: 12px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        transition: background-color 0.3s ease, transform 0.3s;
        flex: 1;
        margin: 0 5px;
    }

    .update-btn {
        background-color: #4CAF50;
        color: white;
    }

    .update-btn:hover {
        background-color: #45a049;
        transform: translateY(-2px);
    }

    .delete-btn {
        background-color: #f44336;
        color: white;
    }

    .delete-btn:hover {
        background-color: #e53935;
        transform: translateY(-2px);
    }

    .cancel-btn {
        background-color: #ccc;
        color: black;
    }

    .cancel-btn:hover {
        background-color: #bbb;
        transform: translateY(-2px);
    }
</style>
