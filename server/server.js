import express from "express";
import cors from "cors";
import sequelize from "./db.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import employeeRoute from "./routes/employeeRoute.js";
import User from "./models/user.js";
import Leave from "./models/leave.js";
import dotenv from 'dotenv';
import * as OpenApiValidator from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import path from 'path'
import { fileURLToPath } from 'url';
import YAML from 'yamljs'; 

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up associations (one-to-many association)
User.hasMany(Leave, { foreignKey: 'e_id' });
Leave.belongsTo(User, { foreignKey: 'e_id' });

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Load and serve Swagger UI
const openAPIFilePath = path.join(__dirname, 'openapi.yml'); 
const swaggerDocument = YAML.load(openAPIFilePath); 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// OpenAPI validation middleware
app.use(
    OpenApiValidator.middleware({
        apiSpec: openAPIFilePath, // Path to your OpenAPI spec
        validateRequests: true, // Validate requests against the OpenAPI spec
        validateResponses: false, // Validate responses against the OpenAPI spec (false by default)
    })
);

app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/employees', employeeRoute);

// Error handling middleware for OpenAPI validation errors
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

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
