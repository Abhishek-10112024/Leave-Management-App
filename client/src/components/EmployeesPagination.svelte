<script>
  import { page, totalPages } from '../store';
  import { fetchEmployees } from '../exportFunction';

  const goToPage = (newPage) => {
// This line defines an arrow function named goToPage, which takes a single parameter newPage. This parameter represents the page number that the user wishes to navigate to.
      if (newPage > 0 && newPage <= $totalPages) {
// This conditional statement checks if the newPage number is valid: It must be greater than 0 & It must be less than or equal to $totalPages
          page.set(newPage);
// If the page number is valid, this line updates the current page by calling set on the page store (also likely a Svelte store). 
// This triggers any reactive statements dependent on page to update automatically in the UI.
          fetchEmployees();
      } else {
          console.warn('Page number out of range:', newPage);
      }
  };
</script>

<div class="pagination-controls">
  <button on:click={() => goToPage(1)}>
<!-- This button, when clicked, will call the goToPage function with an argument of 1, directing the user to the first page of the pagination. -->
    First
  </button>
  <button on:click={() => goToPage($page - 1)}>
<!-- This button navigates to the previous page by calling goToPage with the current page number minus one ($page - 1). -->
    &lt;
  </button>
  <span id="pageDisplay">Page {$page} of {$totalPages}</span>
<!-- This <span> displays the current page and the total number of pages. It uses Svelte's reactive syntax ($) to automatically update when the values of $page or $totalPages change. -->
  <button on:click={() => goToPage($page + 1)}>
<!-- This button directs the user to the next page by calling goToPage with the current page number plus one ($page + 1). -->
    &gt;
  </button>
  <button on:click={() => goToPage($totalPages)}>
<!-- This button navigates to the last page of the pagination by calling goToPage with the total number of pages ($totalPages). -->
    Last
  </button>
</div>
  
  <style>
    .pagination-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
    }
  
    .pagination-controls button {
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
  
    .pagination-controls button:hover {
      background-color: #0056b3;
      border-color: #0056b3;
    }
  
    .pagination-controls button:disabled {
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
  </style>
  