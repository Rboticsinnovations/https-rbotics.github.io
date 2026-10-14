import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: false, unique: true, sparse: true },
    phone: { type: String, required: false, unique: true, sparse: true },
    password: { type: String, required: false },
    name: { type: String, default: 'Customer' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    refreshToken: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', userSchema);
