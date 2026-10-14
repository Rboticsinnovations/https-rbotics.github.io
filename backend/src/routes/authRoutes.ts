import { Router } from 'express';
import { register, login, refreshToken, logout, verifyOtp, setPassword } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/set-password', setPassword);
router.get('/refresh', refreshToken);
router.post('/logout', logout);

export default router;
