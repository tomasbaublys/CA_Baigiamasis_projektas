import { Router } from "express";

import { login, loginAuto, register } from "../controllers/usersController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post('/login', login);
router.post('/auto-login', authenticateToken,loginAuto);

router.post('/register', register);

export default router;