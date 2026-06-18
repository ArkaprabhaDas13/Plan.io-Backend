import express from 'express';
import {verifyToken} from '../middleware/authMiddleware.js'
import {showAllAudits} from '../controllers/auditController.js'

const router = express.Router();

router.get('/getAllAudits', verifyToken, showAllAudits);

export default router;