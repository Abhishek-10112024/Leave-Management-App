import { get } from 'svelte/store';
import { navigate } from 'svelte-routing';
import { status, employees, page, limit, totalPages, leaves, leaveRequests } from './store';

export const fetchEmployees = async () => { // This defines an async function that can handle asynchronous operations, allowing the use of await for promises (await being used in down in the code during fetching response)
    try {
        const page_num = get(page); // Inside the function, it retrieves the current page number and limit from the Svelte stores
        const limit_val = get(limit);
        const token = localStorage.getItem('token'); // the user’s token and role from local storage.
        const userRole = localStorage.getItem('userRole');

        if (!userRole || !token) {
            console.error('Token or userRole is missing:');
            return;
        }

        const response = await fetch(`http://localhost:3000/api/employees?page=${page_num}&limit=${limit_val}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            employees.set(data.employees); // Upon a successful response, it updates the employees and totalPages stores with the fetched data (as set in controller in server)
            totalPages.set(data.totalPages);
        } else if (response.status === 401) {
            localStorage.removeItem('token'); // If the response indicates an unauthorized error (401), it clears the token and navigates the user to the login page
            navigate('/');
        } else if (response.status === 403) { // For forbidden access (403), it logs the error message returned from the server.
            const errorData = await response.json();
            console.error('Access denied:', errorData.message); 
        } else {
            console.error('Failed to fetch employees:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

// When using await with fetch, the function pauses execution until the promise resolves. 
// This means that you will always have a response object available right after the await fetch(...) line, allowing you to evaluate its status immediately.
export const fetchLeaveRequests = async () => {
    try {
        const page_num = get(page);
        const limit_val = get(limit);
        const currentStatus = get(status);
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch(`http://localhost:3000/api/leaves?page=${page_num}&limit=${limit_val}&status=${currentStatus}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            leaves.set(data.leaves);
            totalPages.set(data.totalPages);
            // status.set(data.status); // no need of this as I am not setting this in backend
        } else if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/');
        } else {
            console.error('Failed to fetch leave requests:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

export const fetchLeaves = async () => {
    try {

        const currentPage = get(page);
        const itemsPerPage = get(limit);
        const currentStatus = get(status);
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch(`http://localhost:3000/api/employees/leaves?page=${currentPage}&limit=${itemsPerPage}&status=${currentStatus}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            leaveRequests.set(data.leaves);
            totalPages.set(data.totalPages);
            // status.set(data.status); no need and I am not returing any status through my backend, whose valuse will be set to this status store.
        } else if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/');
        } else {
            console.error('Failed to fetch leave requests:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};