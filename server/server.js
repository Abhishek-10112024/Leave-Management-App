import express from "express";
import cors from "cors";
import sequelize from "./db.js";
import exp from "constants";

const app = express();

app.use(express.json());
app.use(cors({
    "origin": 'http://localhost:3000',
    credentials: true
}));

const port = 5000;

sequelize.sync().then(() => {
    console.log('Synchronized')
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Failed to sync database:', err);
});


