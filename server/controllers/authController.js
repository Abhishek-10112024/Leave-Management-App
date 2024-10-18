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

        const { role: adminRole } = req.user; 
        if (adminRole !== 'admin') {
            return res.status(403).json({ message: "Only admins can register new users." });
        }

        if (!e_name || !e_email || !e_password || !e_dept) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const userExists = await User.findOne({ where: { e_email } });
        if (userExists) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(e_password, 10);
        await User.create({ 
            e_name, 
            e_dept, 
            e_email, 
            e_password: hashedPassword, 
            e_role: e_role || 'employee' 
        });

        return res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { e_email, e_password } = req.body;

        if (!e_email || !e_password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const user = await User.findOne({ where: { e_email } });
        if (!user || !(await bcrypt.compare(e_password, user.e_password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.e_id, name: user.e_name, email: user.e_email, role: user.e_role }, secretKey, { expiresIn: '1h' });
        return res.status(200).json({ message: "Log in successful!", token, userRole: user.e_role });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        addToBlacklist(token); 
    }
    res.json({ message: "Logout successful" });
};
