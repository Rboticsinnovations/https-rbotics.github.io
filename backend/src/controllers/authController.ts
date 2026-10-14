import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const generateAccessToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' });
};

const generateRefreshToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, phone, password, name } = req.body;
        
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const user = new User({
            email,
            phone,
            password: hashedPassword,
            name,
            otp,
            otpExpiry,
            isVerified: false
        });

        await user.save();

        if (email) {
            const msg = {
                to: email,
                from: process.env.SENDGRID_FROM_EMAIL!,
                subject: 'Rbotics Innovations - Verify your account',
                text: `Your OTP for registration is ${otp}. It is valid for 10 minutes.`,
                html: `<strong>Your OTP for registration is ${otp}</strong>. It is valid for 10 minutes.`,
            };
            try {
                await sgMail.send(msg);
            } catch (err) {
                console.error('SendGrid error:', err);
            }
        }

        res.status(201).json({ success: true, message: 'OTP sent to email. Please verify.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'User already verified' });
        }

        if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Account verified successfully. You can now set your password.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const setPassword = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (!user.isVerified) return res.status(400).json({ success: false, message: 'User must be verified first' });

        user.password = await bcrypt.hash(password, 10);
        
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id, user.role);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
        
        res.status(200).json({ success: true, message: 'Password set successfully!', accessToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { loginId, password } = req.body;
        
        const user = await User.findOne({ $or: [{ email: loginId }, { phone: loginId }] });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (user.email && !user.isVerified) {
            return res.status(401).json({ success: false, message: 'Please verify your email first (OTP).' });
        }

        if (password && user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id, user.role);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('jwt', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
        
        res.json({ success: true, accessToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    
    const refreshToken = cookies.jwt;
    const user = await User.findOne({ refreshToken });
    if (!user) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any, decoded: any) => {
        if (err || user.id !== decoded.userId) return res.sendStatus(403);
        const accessToken = generateAccessToken(user.id, user.role);
        res.json({ accessToken });
    });
};

export const logout = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    
    const refreshToken = cookies.jwt;
    const user = await User.findOne({ refreshToken });
    if (user) {
        user.refreshToken = '';
        await user.save();
    }
    
    res.clearCookie('jwt', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.sendStatus(204);
};
