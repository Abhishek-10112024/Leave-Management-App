import express from "express";
import cors from "cors";
import sequelize from "./db.js";
import authRoute from "./routes/authRoute.js";
import leaveRoute from "./routes/leaveRoute.js";
// import userRoute from "./routes/userRoute.js";

const app = express();

app.use(express.json());
app.use(cors({
    "origin": 'http://localhost:5173',
    credentials: true
}));

app.use('/api/auth', authRoute);
app.use('/api/leaves', leaveRoute);

const port = 3000;

sequelize.sync().then(() => {
    console.log('Synchronized')
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Failed to sync database:', err);
});


