import express from 'express';
import Task from './../models/Tasks.js';
import { getAllTasks, createTask, editTask, deleteTask, createComment, getAllComments, getProjectTasks } from '../controllers/taskController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllTasks);
router.post('/', verifyToken, createTask);
router.patch('/:taskId', verifyToken, editTask);
router.delete('/:taskId', verifyToken, deleteTask); 
router.post('/:taskId/comments', verifyToken, createComment); 
router.get('/:taskId/comments', verifyToken, getAllComments);
router.get('/project/:projectId', verifyToken, getProjectTasks);

export default router;