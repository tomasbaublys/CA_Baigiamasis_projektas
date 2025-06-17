import { Router } from "express";

import { login, loginAuto, refreshToken, register } from "../controllers/usersController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.get('/login-auto', authenticateToken, loginAuto);

export default router;