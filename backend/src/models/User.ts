import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: false, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, required: false, unique: true, sparse: true, trim: true },
    password: { type: String, required: false },
    name: { type: String, default: 'Customer' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    refreshToken: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', userSchema);
