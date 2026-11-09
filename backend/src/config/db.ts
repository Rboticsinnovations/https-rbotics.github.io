import mongoose from 'mongoose';

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rbotics';
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('MongoDB Connected successfully');
    } catch (error: any) {
        // Keep the server running so the default admin (from .env) can still log in.
        console.warn(`MongoDB unavailable (${error.message}). Only the default admin login will work.`);
    }
};
