import { Response } from 'express';
import mongoose from 'mongoose';
import { User, toPublicUser } from '../models/User';
import { AuthRequest } from '../middleware/auth';

/** GET /api/users — all registered users, newest first (admin only). */
export const listUsers = async (_req: AuthRequest, res: Response) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({ success: true, users: users.map(toPublicUser) });
    } catch (error) {
        console.error('List users error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/** DELETE /api/users/:id — remove a user (admin only). Admin accounts cannot be deleted here. */
export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const id = String(req.params.id);
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: 'Invalid user id' });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.role === 'admin') {
            return res.status(403).json({ success: false, message: 'Admin accounts cannot be deleted' });
        }
        await user.deleteOne();
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
