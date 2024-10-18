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
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');

        if (!userRole || !token) {
            console.error('Token or userRole is missing:');
            return;
        }

        const response = await fetch(`http://localhost:3000/api/admin/employees?page=${page_num}&limit=${limit_val}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            employees.set(data.employees);
            totalPages.set(data.totalPages);
        } else if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/');
        } else if (response.status === 403) {
            const errorData = await response.json();
            console.error('Access denied:', errorData.message); 
        } else {
            console.error('Failed to fetch employees:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

export const fetchLeaveRequests = async () => {
    try {
        const page_num = get(page);
        const limit_val = get(limit);
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch(`http://localhost:3000/api/admin/leaves?page=${page_num}&limit=${limit_val}`, {
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
