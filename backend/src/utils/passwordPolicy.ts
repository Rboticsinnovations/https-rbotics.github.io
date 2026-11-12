/**
 * Password rules shared by register and reset-password.
 * Keep in sync with PASSWORD_RULES in src/utils/passwordPolicy.ts (frontend).
 */
export const PASSWORD_RULES: { test: (pw: string) => boolean; message: string }[] = [
    { test: pw => pw.length >= 8, message: 'at least 8 characters' },
    { test: pw => /[A-Z]/.test(pw), message: 'one capital letter' },
    { test: pw => /[0-9]/.test(pw), message: 'one number' },
    { test: pw => /[^A-Za-z0-9]/.test(pw), message: 'one symbol (e.g. @ # $ !)' },
];

/** Returns an error message if the password breaks a rule, otherwise null. */
export const validatePassword = (password: string): string | null => {
    const missing = PASSWORD_RULES.filter(r => !r.test(password)).map(r => r.message);
    return missing.length ? `Password must contain ${missing.join(', ')}.` : null;
};
