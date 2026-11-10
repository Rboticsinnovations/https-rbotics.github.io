import mongoose from 'mongoose';

const RETRY_MS = 5000;

/**
 * Connect to MongoDB, retrying until it is reachable. Never crashes the server.
 * Users (including admins) live only in the `users` collection — create an admin with:
 *   npm run create-user -- <email> <password> <name> admin
 */
export const connectDB = async (): Promise<void> => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rbotics';
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log(`MongoDB connected (database: ${mongoose.connection.name})`);
    } catch (error: any) {
        console.error(
            `MongoDB unavailable (${error.message}).\n` +
            `  Login/register will return 503 until it connects. Check MONGODB_URI in backend/.env\n` +
            `  and that this machine's IP is allowed in Atlas → Network Access.\n` +
            `  Retrying in ${RETRY_MS / 1000}s...`
        );
        setTimeout(connectDB, RETRY_MS);
    }
};
