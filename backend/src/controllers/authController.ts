import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, toPublicUser, UserDoc } from '../models/User';

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

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** Reject with 503 while MongoDB is not connected. */
export const requireDb = (_req: Request, res: Response, next: NextFunction) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ success: false, message: 'Database unavailable. Please try again later.' });
    }
    next();
};

/** Rotate the refresh token, set the cookie, and send the session response. */
const startSession = async (res: Response, user: UserDoc, status = 200, message?: string) => {
    const refreshToken = generateRefreshToken(user.id, user.role);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('jwt', refreshToken, { ...cookieOptions, maxAge: SESSION_MAX_AGE_MS });
    res.status(status).json({
        success: true,
        message,
        accessToken: generateAccessToken(user.id, user.role),
        user: toPublicUser(user),
    });
};

const isDuplicateKeyError = (err: unknown) => (err as { code?: number })?.code === 11000;

export const register = async (req: Request, res: Response) => {
    try {
        const password: string = req.body.password || '';
        const name: string = req.body.name?.trim() || undefined;
        // Treat empty strings as "not provided" so they don't collide in lookups / unique indexes
        const email: string | undefined = req.body.email?.trim().toLowerCase() || undefined;
        const phone: string | undefined = req.body.phone?.trim() || undefined;

        if (!email && !phone) {
            return res.status(400).json({ success: false, message: 'Email or mobile number is required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const conditions = [email && { email }, phone && { phone }].filter(Boolean) as object[];
        if (await User.exists({ $or: conditions })) {
            return res.status(409).json({ success: false, message: 'An account with this email or mobile already exists' });
        }

        // New accounts are always 'user'; admin records are created with `npm run create-user ... admin`.
        const user = new User({ email, phone, name, password: await bcrypt.hash(password, 10), role: 'user' });
        await startSession(res, user, 201, 'Account created successfully!');
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            return res.status(409).json({ success: false, message: 'An account with this email or mobile already exists' });
        }
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const loginId: string = req.body.loginId?.trim() || '';
        const password: string = req.body.password || '';
        if (!loginId || !password) {
            return res.status(400).json({ success: false, message: 'Login ID and password are required' });
        }

        const user = await User.findOne({ $or: [{ email: loginId.toLowerCase() }, { phone: loginId }] })
            .select('+password');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid email/mobile or password' });
        }

        await startSession(res, user, 200, 'Login successful!');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.jwt;
        if (!token) return res.sendStatus(401);

        let decoded: { userId: string };
        try {
            decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { userId: string };
        } catch {
            return res.sendStatus(401);
        }

        // Old sessions (e.g. the former env-only admin id) are not valid ObjectIds — force re-login.
        if (!mongoose.isValidObjectId(decoded.userId)) return res.sendStatus(401);

        const user = await User.findById(decoded.userId).select('+refreshToken');
        if (!user || user.refreshToken !== token) return res.sendStatus(401);

        res.json({ accessToken: generateAccessToken(user.id, user.role), user: toPublicUser(user) });
    } catch (error) {
        console.error('Refresh error:', error);
        res.sendStatus(500);
    }
};

export const logout = async (req: Request, res: Response) => {
    const token = req.cookies?.jwt;
    if (token && mongoose.connection.readyState === 1) {
        await User.updateOne({ refreshToken: token }, { $unset: { refreshToken: 1 } }).catch(() => {});
    }
    res.clearCookie('jwt', cookieOptions);
    res.sendStatus(204);
};
