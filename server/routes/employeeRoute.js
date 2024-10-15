import express from 'express';
import {createLeaveRequest,getLeaveRequests,modifyLeaveRequest,deleteLeaveRequest,} from '../controllers/employeeController.js';
import { userAuthentication } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(userAuthentication);

router.post('/', createLeaveRequest);
router.get('/', getLeaveRequests);
router.patch('/:leave_id', modifyLeaveRequest);
router.delete('/:leave_id', deleteLeaveRequest);

export default router;
