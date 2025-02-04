import express from "express";
import cors from "cors";
import sequelize from "./db.js";
import authRoute from "./routes/authRoute.js";
import leavesRoute from "./routes/leavesRoute.js";
import employeesRoute from "./routes/employeesRoute.js";
import User from "./models/user.js";
import Leave from "./models/leave.js";
import dotenv from 'dotenv';
import * as OpenApiValidator from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import path from 'path'
import { fileURLToPath } from 'url';
import YAML from 'yamljs'; 

dotenv.config();
// The config() method reads the contents of a .env file located in the root directory of your project.

const __filename = fileURLToPath(import.meta.url);
// In ES modules, import.meta provides metadata about the module, including its URL. This is a URL string that represents the module's location.
// fileURLToPath(...): This function, typically imported from the url module, converts the URL string into a file path. This is necessary because Node.js primarily works with file paths rather than URLs.
// The result is stored in the __filename variable, which now holds the absolute path of the current module file.
const __dirname = path.dirname(__filename);
// path.dirname(...): This function, imported from the path module, extracts the directory name from the full file path provided by __filename.
// The result is stored in the __dirname variable, which now holds the absolute path of the directory containing the current module file.

// Set up associations (one-to-many association)
User.hasMany(Leave, { foreignKey: 'e_id' });
// This line defines a one-to-many relationship where one User can have multiple Leave records.
// hasMany: This method indicates that the User model can have multiple associated Leave entries.
// { foreignKey: 'e_id' }: This specifies that the foreign key in the Leave table referencing the User table is e_id. 
// Each leave request will have an e_id that corresponds to the id of the user who requested it.
Leave.belongsTo(User, { foreignKey: 'e_id' });
// This line establishes the inverse relationship, indicating that each Leave record belongs to a single User.
// belongsTo: This method indicates that the Leave model is associated with a single User.
// { foreignKey: 'e_id' }: This again specifies that the e_id field in the Leave table acts as a foreign key that links to the User table.

const app = express(); //  initializes an Express application

app.use(express.json());
// app.use(...): This method mounts the specified middleware function(s) to the Express application. 
// Middleware functions have access to the request and response objects and can modify them or end the request-response cycle.
// express.json(): This is a built-in middleware function in Express that parses incoming requests with JSON payloads. 
// It reads the body of the request and converts it from a JSON string into a JavaScript object.
// This middleware is particularly useful for handling POST or PUT requests where the client sends data in JSON format.
app.use(cors({
    // This method adds CORS middleware to the Express application. 
    // CORS is a security feature that allows or restricts resources requested from a different origin (domain, protocol, or port).
    origin: 'http://localhost:5173',
    credentials: true,
    // This option allows credentials (such as cookies, authorization headers, or TLS client certificates) to be included in cross-origin requests.
}));

// Load and serve Swagger UI
const openAPIFilePath = path.join(__dirname, 'openapi.yml'); 
// This declares a constant variable named openAPIFilePath that will hold the constructed file path.
// path.join: This is a method from the path module in Node.js that joins multiple path segments together, ensuring the correct directory separators are used based on the operating system
// __dirname: This is a special variable in Node.js that contains the absolute path to the directory that contains the current module file.
const swaggerDocument = YAML.load(openAPIFilePath);
// This declares a constant variable named swaggerDocument that will hold the parsed content of the YAML file.
// YAML is typically imported from a library like js-yaml. The load method is used to parse the contents of a YAML file and convert it into a JavaScript object.
// This is the variable containing the path to the openapi.yml file, which was constructed in the previous step 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// This method mounts middleware at the specified path (/api-docs). When a client accesses this path, the specified middleware will be executed.
// swaggerUi.serve: This is a middleware function provided by the swagger-ui-express package. It serves the static files required to render the Swagger UI, which is a visual representation of the API documentation.
// swaggerUi.setup(swaggerDocument): This method configures the Swagger UI using the provided swaggerDocument, which contains the parsed OpenAPI specification (from the YAML file).

// OpenAPI validation middleware
app.use(
    OpenApiValidator.middleware({ // This line applies the OpenApiValidator middleware to the Express application. 
        // It will intercept incoming requests and validate them against the specified OpenAPI specification.
        apiSpec: openAPIFilePath, // Path to your OpenAPI spec
        validateRequests: true, // Validate requests against the OpenAPI spec
        validateResponses: false, // Validate responses against the OpenAPI spec (false by default)
    })
);

app.use('/api/auth', authRoute);
app.use('/api', leavesRoute);
app.use('/api/employees', employeesRoute);

// Error handling middleware for OpenAPI validation errors
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

const port = process.env.PORT || 3000;

sequelize.sync({ alter: false }) // force: false: This option indicates that existing tables should not be dropped and recreated. 
// If set to true, it would drop and recreate tables, which is useful for development but not safe for production data.
    .then(() => { 
        // .then(() => { ... }): This is a promise handler that executes when the database synchronization is successful. 
        console.log('Database synchronized successfully.');
        app.listen(port, () => { // This starts the Express server, listening on the specified port.
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to sync database:', err);
    });
