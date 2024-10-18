import { writable, get } from 'svelte/store';
import { navigate } from 'svelte-routing';

export const page = writable(1);
export const limit = writable(10);
export const totalPages = writable(1);
export const employees = writable([]);
export const leaves = writable([]);

export const fetchEmployees = async () => {
    try {
      const page_num = get(page);
      const limit_val = get(limit);
      const token = localStorage.getItem('token'); // Retrieve JWT token
      console.log('Stored token:', token);
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch(`http://localhost:3000/api/employees?page=${page_num}&limit=${limit_val}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include token in header
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        employees.set(data.employees); 
        totalPages.set(data.totalPages); 
      } else if (response.status === 401) {
        // Handle token expiration or invalid token
        localStorage.removeItem('token');
        navigate('/'); // Redirect to login page
      } else {
        console.error('Failed to fetch data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }


  export const fetchLeaveRequests = async () => {
    try {
      const page_num = get(page);
      const limit_val = get(limit);
      const token = localStorage.getItem('token'); // Retrieve JWT token
      console.log('Stored token:', token);
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch(`http://localhost:3000/api/leaves?page=${page_num}&limit=${limit_val}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include token in header
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        leaves.set(data.leaves); 
        totalPages.set(data.totalPages); 
      } else if (response.status === 401) {
        // Handle token expiration or invalid token
        localStorage.removeItem('token');
        navigate('/'); // Redirect to login page
      } else {
        console.error('Failed to fetch data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }