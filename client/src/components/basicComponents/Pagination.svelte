<script>
    import { createEventDispatcher } from 'svelte';
    import { totalPages } from '../../store';
  
    const dispatch = createEventDispatcher(); // Event dispatcher to communicate with the parent
  
    export let currentPage = 1;  // The current page value passed from the parent as a prop
  
    
  // Function to handle page changes
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= $totalPages) {
      currentPage = newPage;  // Update internal state
      inputPage = currentPage;
      dispatch('pageChange', newPage);  // Dispatch the new page number to the parent
    }
  };

  // Handle the input change and navigate to that page
  let inputPage = currentPage; // Bind the input field to the currentPage value
  
  const goToPage = () => {
    if (inputPage >= 1 && inputPage <= $totalPages) {
      changePage(inputPage);
    }
  };
  </script>
    
  <div class="pagination">
    <button on:click={() => changePage(1)} disabled={currentPage === 1}>First</button>
    <button on:click={() => changePage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
    <span id="pageDisplay">
      Page 
      {currentPage}
      of {$totalPages}
      <input 
        type="number" 
        min="1" 
        max={$totalPages} 
        placeholder= "go to page"
        bind:value={inputPage} 
        on:input={goToPage} 
        class="page-input" 
      />
    </span>
    <button on:click={() => changePage(currentPage + 1)} disabled={currentPage === $totalPages}>Next</button>
    <button on:click={() => changePage($totalPages)} disabled={currentPage === $totalPages}>Last</button>

  </div>  
  
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
      font-size: 13px;
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
      font-size: 13px;
      color: aliceblue;
    }  
  </style>
  