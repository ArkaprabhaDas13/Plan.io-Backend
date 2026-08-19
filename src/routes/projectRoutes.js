import express from 'express';
import { createProject, getAllProjects, getOneProject, updateProject, deleteProject, getProjectTasks, getProjectStats } from '../controllers/projectController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:projectId/tasks', verifyToken, getProjectTasks)
router.post('/', verifyToken, createProject);
router.get('/', verifyToken, getAllProjects);
router.get('/:projectId', verifyToken, getOneProject);
router.patch('/:projectId', verifyToken, updateProject);
router.delete('/:projectId', verifyToken, deleteProject);
router.get('/statistics/all', verifyToken, getProjectStats)

export default router;