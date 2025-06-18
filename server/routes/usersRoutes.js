import { Router } from "express";
import { login, loginAuto, refreshToken, register, getUserId, updateUser } from "../controllers/usersController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get('/login-auto', authenticateToken, loginAuto);
router.get('/id', authenticateToken, getUserId);
router.patch('/:id', authenticateToken, updateUser);

export default router;