import express from 'express';
import {getAllLeaveRequests, getAllEmployees, updateLeaveStatus} from '../controllers/adminController.js';
import { userAuthentication } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(userAuthentication(['admin']));

router.get('/leaves', getAllLeaveRequests);
router.get('/employees', getAllEmployees);
router.put('/leaves/:leave_id', updateLeaveStatus);

export default router;
