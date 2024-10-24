import jwt from "jsonwebtoken";
import { isBlacklisted } from './tokenBlacklist.js';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET || 'your-jwt-secret-key'; //  initializes a secretKey for JWT operations, using an environment variable if available and falling back to a default value if not.

export const userAuthentication = (requiredRoles = []) => { 
    // This is a function parameter with a default value. If no argument is provided when the function is called, requiredRoles will be initialized as an empty array.
    // The purpose of this parameter is to specify roles that are required for a user to access certain resources or routes within the application.
     return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        // req.headers['authorization']: This accesses the Authorization header. It contains a string formatted as Bearer <token>.
        // ?.: The optional chaining operator (?.) is used to safely access the split method. If req.headers['authorization'] is undefined or null, it will not throw an error; instead, token will be undefined.
        // .split(' ')[1]: This splits the string by spaces and retrieves the second part, which is the actual token (after the "Bearer" part).
        if (isBlacklisted(token)) {
            return res.status(401).json({ message: "Token has been invalidated" });
        }
        
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            // This line calls the verify method from the jsonwebtoken library to validate the token against a secret key.
            // token: This is the JWT that needs to be verified.
            // secretKey: This is the secret used to sign the JWT. It ensures that the token was created by a trusted source.
            // The third argument is a callback function that handles the result of the verification.
            // err: If an error occurs during verification (e.g., the token is expired or invalid), this parameter will contain the error information.
            // decoded: If the token is valid, this will contain the decoded payload of the JWT, which typically includes user information or claims.
            if (err) {
                return res.status(401).json({ message: "Invalid token" });
            }
            req.user = decoded;
            // If the token is valid and no error occurred, this line assigns the decoded payload to req.user. 
            // This allows subsequent middleware or route handlers to access user information that was included in the token (e.g., user ID, roles, etc.).

            if (requiredRoles.length && !requiredRoles.includes(req.user.role)) {
                // requiredRoles.length: This checks if there are any roles specified in the requiredRoles array. If this array is empty, the condition evaluates to false, and the code inside the if block is skipped.
                // !requiredRoles.includes(req.user.role): This checks if the user's role (stored in req.user.role) is not included in the requiredRoles array. 
                // The includes method returns true if the user's role matches one of the required roles, so the negation (!) checks for the opposite.
                return res.status(403).json({ message: "Forbidden: You do not have permission to perform this action" });
            }

            next();
        });
    };
};