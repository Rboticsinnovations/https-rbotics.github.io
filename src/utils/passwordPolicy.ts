/**
 * Password rules shared by register and forgot-password.
 * Keep in sync with backend/src/utils/passwordPolicy.ts (the backend enforces them too).
 */
export const PASSWORD_RULES: { label: string; test: (pw: string) => boolean }[] = [
    { label: 'At least 8 characters', test: pw => pw.length >= 8 },
    { label: 'One capital letter (A-Z)', test: pw => /[A-Z]/.test(pw) },
    { label: 'One number (0-9)', test: pw => /[0-9]/.test(pw) },
    { label: 'One symbol (e.g. @ # $ !)', test: pw => /[^A-Za-z0-9]/.test(pw) },
];

export const isStrongPassword = (pw: string) => PASSWORD_RULES.every(r => r.test(pw));
