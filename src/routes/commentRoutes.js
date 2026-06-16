import express from 'express';
import {deleteComment, editComment} from '../controllers/commentsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.patch('/:commentId', verifyToken, editComment);
router.delete('/:commentId', verifyToken, deleteComment);

export default router;