import express from 'express';
import {createLeaveRequest,getLeaveRequests,modifyLeaveRequest,deleteLeaveRequest,} from '../controllers/employeeController.js';
import { userAuthentication } from "../middlewares/authMiddleware.js";

const router = express.Router();
// router.use(userAuthentication);
// By passing ['employee'],it is specifying that only users with the "employee" role can proceed to the next middleware or route handler.

router.post('/leaves', userAuthentication(), createLeaveRequest);
router.get('/leaves', userAuthentication(), getLeaveRequests);
router.patch('/leaves/:leave_id', userAuthentication(), modifyLeaveRequest);
router.delete('/leaves/:leave_id', userAuthentication(), deleteLeaveRequest);

export default router;
