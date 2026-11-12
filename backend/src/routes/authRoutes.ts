import { Router } from 'express';
import { register, login, refreshToken, logout, resetPassword, requireDb } from '../controllers/authController';

const router = Router();

router.post('/register', requireDb, register);
router.post('/login', requireDb, login);
router.get('/refresh', requireDb, refreshToken);
router.post('/reset-password', requireDb, resetPassword);
router.post('/logout', logout);

export default router;
