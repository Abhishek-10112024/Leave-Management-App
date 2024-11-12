<script>
    import { createEventDispatcher } from 'svelte';
    import { totalPages } from '../../store';

    const dispatch = createEventDispatcher(); // Event dispatcher to communicate with the parent

    export let currentPage = 1;  // Current page as a prop
    export let currentStatus = ''; // Status filter as a prop
  
    // const goToPage = (newPage) => {
    //   if (newPage > 0 && newPage <= $totalPages) {
    //     page.set(newPage);
    //     fetchLeaveRequests();
    //   } else {
    //     console.warn('Page number out of range:', newPage);
    //   }
    // };

    
  // Function to handle page changes
  const changePage = (newPage) => {
    if (newPage >= 1) {
      dispatch('pageChange', newPage);  // Dispatch the new page number to the parent
    }
  };

  // Function to handle status changes
  const changeStatus = (event) => {
    // Access value directly from event.target
    const newStatus = event.target.value;
    dispatch('statusChange', newStatus);  // Dispatch the new value
  };
  </script>
  
  <!-- <div class="pagination-controls">
    <button on:click={() => changePage(1)}>
      First
    </button>
    <button on:click={() => changePage($page - 1)}>
      &lt;
    </button>
    <span id="pageDisplay">Page {$page} of {$totalPages}</span>
    <button on:click={() => changePage($page + 1)}>
      &gt;
    </button>
    <button on:click={() => changePage($totalPages)}>
      Last
    </button>
  </div> 
-->
  <div class="pagination">
    <button on:click={() => changePage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
    <span id="pageDisplay">Page {currentPage}</span>
    <button on:click={() => changePage(currentPage + 1)} disabled={currentPage === $totalPages}>Next</button>
  </div>  

  <select on:change={changeStatus} bind:value={currentStatus}>
    <option value={"all"}>All Leaves</option>
    <option value="accepted">Accepted</option>
    <option value="pending">Pending</option>
    <option value="rejected">Rejected</option>
  </select>
  
  <style>
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
    }
  
    .pagination button {
      margin: 0 8px;
      padding: 8px 15px;
      font-size: 1rem;
      border: 2px solid transparent;
      background-color: #007bff;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s, border-color 0.3s;
    }
  
    .pagination button:hover {
      background-color: #0056b3;
      border-color: #0056b3;
    }
  
    .pagination button:disabled {
      background-color: #d6d6d6;
      color: #a0a0a0;
      cursor: not-allowed;
      border-color: #d6d6d6;
    }
  
    #pageDisplay {
      margin: 0 12px;
      font-weight: bold;
      font-size: 1.1rem;
    }

    select {
    font-size: 16px;
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
  