import express from 'express';
import {getAllLeaveRequests, getAllEmployees, updateLeaveStatus} from '../controllers/adminController.js';
import { userAuthentication } from "../middlewares/authMiddleware.js";

const router = express.Router();
// router.use(userAuthentication);

router.get('/leaves', userAuthentication(), getAllLeaveRequests);
router.get('/employees', userAuthentication(), getAllEmployees);
router.patch('/leaves/:leave_id', userAuthentication(), updateLeaveStatus);

export default router;
