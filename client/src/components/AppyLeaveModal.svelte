<script>
    import { createEventDispatcher } from 'svelte';
    import { navigate } from 'svelte-routing';

    const dispatch = createEventDispatcher();
    
    let leave_from = '';
    let leave_to = '';
    let reason = '';
    let error = '';
    
    const applyLeave = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ leave_from, leave_to, reason }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                alert('Leave request submitted successfully!');
                dispatch('close');
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
    };
</script>

<div class="modal">
    <div class="modal-content">
        <h2>Apply for Leave</h2>
        <input type="date" bind:value={leave_from} required placeholder="Leave From" />
        <input type="date" bind:value={leave_to} required placeholder="Leave To" />
        <textarea bind:value={reason} placeholder="Reason for leave" required></textarea>
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
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    h2 {
        margin-bottom: 20px;
        color: #333;
        font-size: 24px;
    }

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

    input[type="date"]:focus,
    textarea:focus {
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

    .submit-btn,
    .cancel-btn {
        padding: 12px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease, transform 0.3s;
        flex: 1;
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
