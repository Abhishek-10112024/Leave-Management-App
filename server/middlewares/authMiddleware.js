import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET || 'your-jwt-secret-key'; 

export const userAuthentication = (requiredRole = null) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" });
            }
            req.user = decoded;

            if (requiredRole && !requiredRole.includes(req.user.role)) {
                return res.status(403).json({ message: "Forbidden: You do not have permission to perform this action" });
            }

            next();
        });
    };
};