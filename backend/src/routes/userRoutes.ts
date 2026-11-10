import { Router } from 'express';
import { requireDb } from '../controllers/authController';
import { listUsers, deleteUser } from '../controllers/userController';
import { verifyToken, verifyAdmin } from '../middleware/auth';

const router = Router();

router.use(verifyToken, verifyAdmin, requireDb);
router.get('/', listUsers);
router.delete('/:id', deleteUser);

export default router;
