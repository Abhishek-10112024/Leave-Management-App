import { writable } from 'svelte/store';

export const page = writable(1); // The writable function creates a store that can be updated
// subscribe: Allows components to listen for changes
// set: Updates the store's value
// update: A method to modify the current value based on a function
export const limit = writable(10);
export const totalPages = writable(1);
export const employees = writable([]);
export const leaves = writable([]);

// Flow of code:
// When the application starts, all writable stores are initialized with default values
// As the user interacts with the application (like changing the page or loading employee data), the values in these stores can be updated using the set or update methods
// Components that use these stores will reactively update when the values change

