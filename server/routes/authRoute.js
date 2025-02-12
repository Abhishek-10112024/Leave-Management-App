import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { userAuthentication } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', userAuthentication, register);
router.post('/login', login);
router.post('/logout', userAuthentication, logout);

export default router;
