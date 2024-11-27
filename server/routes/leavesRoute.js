import express from 'express';
import {getAllLeaveRequests, updateLeaveStatus, getOneLeaveRequest, createLeaveRequest, modifyLeaveRequest, deleteLeaveRequest, getLeaveRequests, getEmployeeLeaves} from '../controllers/leavesController.js';
import { userAuthentication } from "../middlewares/authMiddleware.js";

const router = express.Router();
// router.use(userAuthentication);

// to get all the leave requests for all the employees with admin access
router.get('/leaves', userAuthentication, getAllLeaveRequests);

// to accept or reject leave with admin access
router.patch('/leaves/:leave_id', userAuthentication, updateLeaveStatus);

// to get a particular leave with admin access
router.get('/leaves/:leave_id', userAuthentication, getOneLeaveRequest);

// to get a particular leave with admin access
router.get('/employees/:e_id/leaves', userAuthentication, getEmployeeLeaves);

// to get the leaverequests of logged in employee
router.get('/my/leaves', userAuthentication, getLeaveRequests);

// to create leave request by logged in employee
router.post('/employee/leaves', userAuthentication, createLeaveRequest);

// to modify leave of logged in employee
router.patch('/employee/leaves/:leave_id', userAuthentication, modifyLeaveRequest);

// to delete leave request of logged in employee
router.delete('/employee/leaves/:leave_id', userAuthentication, deleteLeaveRequest);


export default router;
