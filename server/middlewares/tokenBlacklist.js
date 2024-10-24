const blacklist = new Set();
// This creates a new Set object named blacklist. 
// A Set is a collection of values that ensures uniqueness, making it ideal for storing tokens that should be invalidated (blacklisted).

export const addToBlacklist = (token) => { 
    // This defines and exports a function called addToBlacklist, which takes a token as an argument.
    blacklist.add(token);
    // Inside the function, the specified token is added to the blacklist. This effectively marks the token as invalid for future authentication attempts.
};

export const isBlacklisted = (token) => {
    // This defines and exports a function called isBlacklisted, which checks if a given token is in the blacklist.
    return blacklist.has(token);
    // The has method checks for the existence of the token in the blacklist and returns true if the token is blacklisted or false otherwise.
};

export const clearBlacklist = () => {
    // The has method checks for the existence of the token in the blacklist and returns true if the token is blacklisted or false otherwise.
    blacklist.clear();
    // blacklist.clear();: This method removes all entries from the blacklist, effectively resetting it.
};