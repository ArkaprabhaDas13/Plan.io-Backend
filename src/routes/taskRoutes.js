import express from 'express';
import Task from './../models/Tasks.js';
import { getAllTasks, createTask, editTask, deleteTask } from '../controllers/taskController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllTasks);
router.post('/', createTask);
router.patch('/:taskId', verifyToken, editTask);
router.delete('/:taskId', verifyToken, deleteTask);  

export default router;