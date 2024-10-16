import express from "express";
import cors from "cors";
import sequelize from "./db.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import employeeRoute from "./routes/employeeRoute.js";
import User from "./models/user.js";
import Leave from "./models/leave.js"
import dotenv from 'dotenv';

dotenv.config();

User.hasMany(Leave, { foreignKey: 'e_id' });
Leave.belongsTo(User, { foreignKey: 'e_id' });

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/employees', employeeRoute);


const port = process.env.PORT || 3000; 

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synchronized successfully.');
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to sync database:', err);
    });
