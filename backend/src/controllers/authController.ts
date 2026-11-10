import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User';

const DEFAULT_ADMIN_ID = 'default-admin';

type PublicUser = { id: string; email?: string | null; name?: string | null; role: string };

const generateAccessToken = (userId: string, role: string) =>
    jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: (process.env.ACCESS_TOKEN_EXPIRY || '15m') as jwt.SignOptions['expiresIn'],
    });

const generateRefreshToken = (userId: string, role: string) =>
    jwt.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || '7d') as jwt.SignOptions['expiresIn'],
    });

// 'strict' works when frontend and backend share a site (e.g. www.rbotics.in + api.rbotics.in).
// Set COOKIE_SAMESITE=none only if they are on unrelated domains (requires HTTPS).
const sameSite = (['strict', 'lax', 'none'].includes(process.env.COOKIE_SAMESITE || '')
    ? process.env.COOKIE_SAMESITE
    : 'strict') as 'strict' | 'lax' | 'none';

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || sameSite === 'none',
    sameSite,
};

const dbReady = () => mongoose.connection.readyState === 1;

/** Default admin account configured via env (works even when MongoDB is unavailable). */
const getDefaultAdmin = () => {
    const email = process.env.DEFAULT_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.DEFAULT_ADMIN_PASSWORD;
    if (!email || !password) return null;
    return { email, password, name: process.env.DEFAULT_ADMIN_NAME || 'Admin' };
};

/** Issue an access token, set the refresh-token cookie, and send the session response. */
const sendSession = (res: Response, user: PublicUser, refreshToken: string, status = 200, message?: string) => {
    const accessToken = generateAccessToken(user.id, user.role);
    res.cookie('jwt', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(status).json({ success: true, message, accessToken, user });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { password, name } = req.body;
        // Treat empty strings as "not provided" so they don't collide in lookups / unique indexes
        const email = req.body.email?.trim().toLowerCase() || undefined;
        const phone = req.body.phone?.trim() || undefined;

        if (!email && !phone) {
            return res.status(400).json({ success: false, message: 'Email or phone is required' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }
        if (email && email === getDefaultAdmin()?.email) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        if (!dbReady()) {
            return res.status(503).json({ success: false, message: 'Database unavailable. Please try again later.' });
        }

        const conditions = [email && { email }, phone && { phone }].filter(Boolean) as object[];
        if (await User.findOne({ $or: conditions })) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = new User({ email, phone, name, password: await bcrypt.hash(password, 10) });
        const refreshToken = generateRefreshToken(user.id, user.role);
        user.refreshToken = refreshToken;
        await user.save();

        sendSession(res, { id: user.id, email: user.email, name: user.name, role: user.role }, refreshToken, 201, 'Account created successfully!');
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const loginId: string = req.body.loginId?.trim() || '';
        const { password } = req.body;
        if (!loginId || !password) {
            return res.status(400).json({ success: false, message: 'Login ID and password are required' });
        }

        // Default admin (from env) — checked before the database
        const admin = getDefaultAdmin();
        if (admin && loginId.toLowerCase() === admin.email) {
            if (password !== admin.password) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
            return sendSession(
                res,
                { id: DEFAULT_ADMIN_ID, email: admin.email, name: admin.name, role: 'admin' },
                generateRefreshToken(DEFAULT_ADMIN_ID, 'admin')
            );
        }

        if (!dbReady()) {
            return res.status(503).json({ success: false, message: 'Database unavailable. Please try again later.' });
        }

        const user = await User.findOne({ $or: [{ email: loginId.toLowerCase() }, { phone: loginId }] });
        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const refreshToken = generateRefreshToken(user.id, user.role);
        user.refreshToken = refreshToken;
        await user.save();

        sendSession(res, { id: user.id, email: user.email, name: user.name, role: user.role }, refreshToken);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.jwt;
        if (!token) return res.sendStatus(401);

        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
        } catch {
            return res.sendStatus(403);
        }

        if (decoded.userId === DEFAULT_ADMIN_ID) {
            if (!getDefaultAdmin()) return res.sendStatus(403);
            return res.json({ accessToken: generateAccessToken(DEFAULT_ADMIN_ID, 'admin') });
        }

        if (!dbReady()) return res.sendStatus(503);
        const user = await User.findOne({ refreshToken: token });
        if (!user || user.id !== decoded.userId) return res.sendStatus(403);

        res.json({ accessToken: generateAccessToken(user.id, user.role) });
    } catch (error) {
        console.error('Refresh error:', error);
        res.sendStatus(500);
    }
};

export const logout = async (req: Request, res: Response) => {
    const token = req.cookies?.jwt;
    if (token && dbReady()) {
        await User.updateOne({ refreshToken: token }, { $set: { refreshToken: '' } }).catch(() => {});
    }
    res.clearCookie('jwt', cookieOptions);
    res.sendStatus(204);
};
