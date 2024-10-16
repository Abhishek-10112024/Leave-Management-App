import express from 'express';
import {createLeaveRequest,getLeaveRequests,modifyLeaveRequest,deleteLeaveRequest,} from '../controllers/employeeController.js';
import { userAuthentication } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(userAuthentication(['employee']));

router.post('/', createLeaveRequest);
router.get('/', getLeaveRequests);
router.patch('/leaves/:leave_id', modifyLeaveRequest);
router.delete('/leaves/:leave_id', deleteLeaveRequest);

export default router;
