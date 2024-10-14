import express from 'express';
import {
    createLeaveRequest,
    getLeaveRequests,
    updateLeaveRequest
} from '../controllers/leaveController.js';
import { userAuthentication, roleAuthorization } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/', createLeaveRequest);
router.get('/:id', userAuthentication, getLeaveRequests);
router.put('/:leave_id', userAuthentication, roleAuthorization('admin'), updateLeaveRequest);

export default router;
