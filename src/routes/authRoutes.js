import User from '../models/Users.js'
import express from 'express'
import validationMiddleware from './../middleware/validationMiddleware.js';
import { registerUser, loginUser, aboutMe } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', validationMiddleware, registerUser);
router.post('/login', loginUser);
router.get('/aboutme', verifyToken, aboutMe);

export default router;  