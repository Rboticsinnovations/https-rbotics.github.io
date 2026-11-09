/**
 * Create (or update) a user for local/dev login.
 *
 * Usage:
 *   npm run create-user -- <email> <password> [name] [role]
 *   npm run create-user -- santosh@rbotics.in "Rbotics@2025" Santosh admin
 *
 * If the user already exists, the password is reset.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

const [email, password, name = 'Customer', role = 'user'] = process.argv.slice(2);

const main = async () => {
    if (!email || !password) {
        console.error('Usage: npm run create-user -- <email> <password> [name] [user|admin]');
        process.exit(1);
    }
    if (!['user', 'admin'].includes(role)) {
        console.error(`Invalid role "${role}". Use "user" or "admin".`);
        process.exit(1);
    }

    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rbotics';
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
        { email: email.trim().toLowerCase() },
        {
            $set: { password: hashed, name, role },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`User ready: ${user.email} (role: ${user.role})`);
    await mongoose.disconnect();
};

main().catch(async (err) => {
    console.error('Failed to create user:', err.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});
