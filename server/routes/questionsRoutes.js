import { Router } from 'express';
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
} from '../controllers/questionsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, createQuestion);
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.patch('/:id', authenticateToken, updateQuestion);
router.delete('/:id', authenticateToken, deleteQuestion);
// - router.patch('/like/:id', authenticateToken, likeQuestion);
// - router.patch('/dislike/:id', authenticateToken, dislikeQuestion);

export default router;