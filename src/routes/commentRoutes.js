import express from 'express';
import {deleteComment, editComment} from '../controllers/commentsController.js';

const router = express.Router();

router.patch('/:commentId', editComment);
router.delete('/:commentId', deleteComment);

export default router;