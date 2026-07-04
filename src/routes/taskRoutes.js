import express from 'express';
import Task from './../models/Tasks.js';
import { getAllTasks, createTask, editTask, deleteTask, getProjectTasks } from '../controllers/taskController.js';
import { createComment, deleteComment, getAllComments } from '../controllers/commentsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllTasks);
router.post('/', verifyToken, createTask);
router.patch('/:taskId', verifyToken, editTask);
router.delete('/:taskId', verifyToken, deleteTask); 
router.get('/:taskId/comments', verifyToken, getAllComments);
router.post('/:taskId/comments', verifyToken, createComment); 
router.delete('/:taskId/comments/:commentId', verifyToken, deleteComment)
router.get('/project/:projectId', verifyToken, getProjectTasks);

export default router;