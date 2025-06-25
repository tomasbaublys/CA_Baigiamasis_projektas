import { Router } from 'express';
import {
  postAnswer,
  getAnswersByQuestionId,
  editAnswer,
  deleteAnswer
} from '../controllers/answersController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/:id/answers', getAnswersByQuestionId);
router.post('/:id/answers', authenticateToken, postAnswer);

router.patch('/:id', authenticateToken, editAnswer);
router.delete('/:id', authenticateToken, deleteAnswer);

export default router;