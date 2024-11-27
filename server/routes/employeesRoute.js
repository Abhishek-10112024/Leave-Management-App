import express from 'express';
import {getProfile, getAllEmployees, deleteEmployee} from '../controllers/employeesController.js';
import { userAuthentication } from "../middlewares/authMiddleware.js";

const router = express.Router();
// router.use(userAuthentication);
// By passing ['employee'],it is specifying that only users with the "employee" role can proceed to the next middleware or route handler.


// to get the user profile of loggged in employee
router.get('/myprofile', userAuthentication(), getProfile);

// to get the list of all employees with admin access
router.get('/', userAuthentication(), getAllEmployees);

// to delete the registered employee with admin access
router.delete('/:e_id', userAuthentication(), deleteEmployee);

export default router;
