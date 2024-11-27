import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { addToBlacklist } from '../middlewares/tokenBlacklist.js';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET || 'your-jwt-secret-key';

export const register = async (req, res) => {
    try {
        const { e_name, e_dept, e_email, e_password, e_role } = req.body;

        const { role: adminRole } = req.user; // This syntax allows you to extract the role property from the req.user object. The role property is then renamed to adminRole for use within the current scope.
        if (adminRole !== 'admin') {
            return res.status(403).json({ message: "Only admins can register new users." });
        }

        if (!e_name || !e_email || !e_password || !e_dept) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const userExists = await User.findOne({ where: { e_email } }); //The where clause is used to filter the records in the User table based on the condition provided. {findOne: Search for a single instance. Returns the first instance found, or null if none can be found.}
        if (userExists) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(e_password, 10); //bcrypt library: is a popular library for hashing passwords , 10: This is the salt rounds parameter. It specifies the complexity of the hashing process.
        // A random salt is generated for each password, usually consisting of a random string of characters.
        // When a user creates or updates their password, the salt is combined with the plaintext password (e.g., salt + password).
        // The combined string is then hashed using a secure hashing algorithm (like bcrypt, PBKDF2, or Argon2).
        // Both the salt and the hashed password are stored in the database. When the user logs in, the salt is retrieved, and the same process is repeated to verify the password.
        // The 10 here means that bcrypt will perform 2^10 (or 1024) hashing iterations on the password combined with the salt. 
        await User.create({ 
            e_name, 
            e_dept, 
            e_email, 
            e_password: hashedPassword, 
            e_role: e_role || 'employee' 
        });

        return res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.error("Registration error:", error); // Log the error for debugging
        res.status(500).json({ message: "Internal server error." });
    }
};

export const login = async (req, res) => {
    try {
        const { e_email, e_password } = req.body;

        if (!e_email || !e_password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const user = await User.findOne({ where: { e_email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (user.deleted === true){
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(e_password, user.e_password);
        // passwordMatch will store the result of the password comparison, which will be a boolean (true or false).
        // bcrypt.compare:
        // 1. It retrieves the salt that was used to hash the stored password.
        // 2. It hashes the provided plaintext password (e_password) using the same salt.
        // 3. It compares the newly hashed value with the stored hashed password (user.e_password).
        // 4. It returns true if they match, indicating that the password is correct, and false if they do not match.
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.e_id, name: user.e_name, email: user.e_email, role: user.e_role }, secretKey, { expiresIn: '1h' });
        // Payload: { id: user.e_id, name: user.e_name, email: user.e_email, role: user.e_role }
        // secretKey: This is a string used to sign the token. It should be kept secure and private, as it ensures that only the server can generate and verify tokens.
        // expiresIn: This sets the expiration time for the token.
        return res.status(200).json({ message: "Log in successful!", token, userRole: user.e_role });

    } catch (error) {
        console.error("Login error:", error); // Log the error for debugging
        res.status(500).json({ message: "Internal server error." });
    }
};

export const logout = (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    // req.headers['authorization']: This accesses the Authorization header. It contains a string formatted as Bearer <token>.
    // ?.: The optional chaining operator (?.) is used to safely access the split method. If req.headers['authorization'] is undefined or null, it will not throw an error; instead, token will be undefined.
    // .split(' ')[1]: This splits the string by spaces and retrieves the second part, which is the actual token (after the "Bearer" part).
    if (token) {
        // This checks if a token was successfully extracted. If the token variable is not undefined or falsy, it proceeds to the next step.
        addToBlacklist(token); 
        // This function call adds the extracted token to a blacklist. The blacklist is a way to keep track of tokens that should no longer be accepted, often used for logout or revoking access.
    }
    res.status(200).json({ message: "Logout successful" });
};
