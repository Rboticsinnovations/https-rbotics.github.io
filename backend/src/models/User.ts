import mongoose, { InferSchemaType, HydratedDocument } from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
        phone: { type: String, unique: true, sparse: true, trim: true },
        // bcrypt hash only — never the plain password. Excluded from queries unless selected with '+password'.
        password: { type: String, required: true, select: false },
        name: { type: String, default: 'Customer', trim: true },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        refreshToken: { type: String, select: false },
    },
    { timestamps: true } // adds createdAt / updatedAt
);

export type UserDoc = HydratedDocument<InferSchemaType<typeof userSchema>>;

/** Shape sent to the frontend (matches AuthUser in src/context/AuthContext.tsx). */
export const toPublicUser = (user: UserDoc) => ({
    id: user.id as string,
    name: user.name,
    email: user.email ?? '',
    mobile: user.phone ?? '',
    role: user.role,
    joinedAt: user.createdAt,
});

export const User = mongoose.model('User', userSchema);
