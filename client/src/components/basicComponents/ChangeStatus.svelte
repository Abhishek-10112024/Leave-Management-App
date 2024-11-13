<script>
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher(); // This function creates an event dispatcher, which allows the child component to send custom events (like statusChange) to the parent.

    export let currentStatus = ''; // Status filter as a prop

  
  // Function to handle status changes
  const changeStatus = (event) => {
    // Access value directly from event.target
    const newStatus = event.target.value;
    dispatch('statusChange', newStatus);  // This line sends the updated newStatus value (the selected value from the dropdown) to the parent component through the statusChange event.
  };
  </script> 
  
  <!-- bind:value={currentStatus}: This creates two-way data binding between the parent’s currentStatus prop and the child’s <select> dropdown. -->
  <select on:change={changeStatus} bind:value={currentStatus}> 
    <option value={"all"}>All Leaves</option>
    <option value="accepted">Accepted</option>
    <option value="pending">Pending</option>
    <option value="rejected">Rejected</option>
  </select>
  
  <style>
  
  select {
    font-size: 13px;
    padding: 10px 15px;
    border: 2px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    color: #333;
    cursor: pointer;
    transition: all 0.3s ease;
  } 
  
  /* Hover styles for the select element */
  select:hover {
    border-color: #007bff;
  }
  
  /* focus styles for the select element */
  select:focus {
    border-color: #0056b3; 
    outline: none; 
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);  /*Add a box shadow to give it a 3D effect */
  }
  
  /* Style for the dropdown options */
  option {
    padding: 10px;
    background-color: #fff;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
  }
  </style>
  