import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const secretKey = 'your-jwt-secret-key';

export const register = async (req, res) => {
    try {
        const { name, team, email, password, role = 'employee' } = req.body;
        
        if (!name || !email || !password || !team) {
            return res.status(422).json({ message: 'Please enter all fields' });
        }

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(409).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, team, email, password: hashedPassword, role });
        return res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(422).json({ message: "Please enter all fields" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (user.role !== role) {
            return res.status(400).json({ message: 'Role mismatch' });
          }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secretKey, { expiresIn: '1h' });  // jwt token generation with payload, secretKey, expiration time
        return res.status(200).json({ message: "Log in successful!" , token, userRole: user.role});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
        res.json({ message: "Logout successful" });
};
