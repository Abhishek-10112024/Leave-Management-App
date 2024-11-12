<script>
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher(); // Event dispatcher to communicate with the parent

    export let currentStatus = ''; // Status filter as a prop

  
  // Function to handle status changes
  const changeStatus = (event) => {
    // Access value directly from event.target
    const newStatus = event.target.value;
    dispatch('statusChange', newStatus);  // Dispatch the new value
  };
  </script> 
  
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
    /* width: 200px; Adjust the width of the dropdown */
    transition: all 0.3s ease;
  } 
  
  /* Hover and focus styles for the select element */
  select:hover {
    border-color: #007bff;
  }
  
  select:focus {
    border-color: #0056b3; 
    outline: none; 
  }
  
  /*Add a box shadow to give it a 3D effect */
  select:focus {
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
  }
  
  /* Style for the dropdown options */
  option {
    padding: 10px;
    background-color: #fff;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
  }
  
  /*Add a hover effect to each option */
  option:hover {
    background-color: #f0f0f0;
  }
  </style>
  