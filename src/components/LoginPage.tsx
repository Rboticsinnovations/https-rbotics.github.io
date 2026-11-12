import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PASSWORD_RULES, isStrongPassword } from '../utils/passwordPolicy';

interface LoginPageProps {
    onClose?: () => void;
    onSuccess?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onClose, onSuccess }) => {
    const { login, register, resetPassword } = useAuth();
    const [mode, setMode] = useState<'login' | 'register' | 'forgot_pwd'>('login');

    // Login: can enter email or mobile
    const [loginId, setLoginId] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register fields
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regMobile, setRegMobile] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');

    // Forgot password fields
    const [resetId, setResetId] = useState('');
    const [resetPassword1, setResetPassword1] = useState('');
    const [resetConfirm, setResetConfirm] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const clearErrors = () => { setError(''); setSuccess(''); };

    const handleMockAction = (msg: string) => {
        setLoading(true);
        clearErrors();
        setTimeout(() => {
            setLoading(false);
            setSuccess(msg);
        }, 1000);
    };

    /** Shared check for "new password" + "confirm password" pairs. Returns an error or ''. */
    const checkNewPassword = (pw: string, confirm: string) => {
        if (!isStrongPassword(pw)) return 'Password must have at least 8 characters, one capital letter, one number and one symbol.';
        if (pw !== confirm) return 'Passwords do not match.';
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        clearErrors();
        await new Promise(r => setTimeout(r, 600));

        if (mode === 'login') {
            const res = await login(loginId.trim(), loginPassword);
            if (res.success) {
                setSuccess(res.message);
                setTimeout(() => {
                    onClose?.();
                    onSuccess?.();
                }, 800);
            } else {
                setError(res.message);
            }
        } else if (mode === 'register') {
            if (!regEmail.trim() && !regMobile.trim()) {
                setError('Please enter an email address or mobile number.');
                setLoading(false);
                return;
            }
            const pwError = checkNewPassword(regPassword, regConfirm);
            if (pwError) {
                setError(pwError);
                setLoading(false);
                return;
            }
            const res = await register(regName.trim(), regEmail.trim(), regMobile.trim(), regPassword);
            if (res.success) {
                setSuccess(res.message);
                setTimeout(() => {
                    onClose?.();
                    onSuccess?.();
                }, 800);
            } else {
                setError(res.message);
            }
        } else if (mode === 'forgot_pwd') {
            if (!resetId.trim()) {
                setError('Please enter your email address or mobile number.');
                setLoading(false);
                return;
            }
            const pwError = checkNewPassword(resetPassword1, resetConfirm);
            if (pwError) {
                setError(pwError);
                setLoading(false);
                return;
            }
            const res = await resetPassword(resetId.trim(), resetPassword1, resetConfirm);
            if (res.success) {
                setSuccess(res.message);
                // Back to sign-in with the account pre-filled
                setTimeout(() => {
                    setLoginId(resetId.trim());
                    setLoginPassword('');
                    setResetPassword1('');
                    setResetConfirm('');
                    setMode('login');
                }, 1500);
            } else {
                setError(res.message);
            }
        }
        setLoading(false);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,15,30,0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
            overflowY: 'auto',
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #0f1729 0%, #1a2340 100%)',
                border: '1px solid rgba(99,179,237,0.2)',
                borderRadius: '20px',
                padding: '2.5rem',
                width: '100%',
                maxWidth: '460px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                position: 'relative',
                margin: 'auto',
            }}>
                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute', top: '1rem', right: '1rem',
                            background: 'rgba(255,255,255,0.08)',
                            border: 'none', color: '#aaa',
                            width: '32px', height: '32px',
                            borderRadius: '50%', cursor: 'pointer',
                            fontSize: '1.2rem', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.2s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
                        onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                        aria-label="Close"
                    >×</button>
                )}

                {/* Logo & Title */}
                <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                    <div style={{
                        width: '56px', height: '56px',
                        background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                        borderRadius: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem',
                        boxShadow: '0 8px 24px rgba(59,130,246,0.4)',
                    }}>
                        <i className="fas fa-robot" style={{ color: '#fff', fontSize: '1.5rem' }}></i>
                    </div>
                    <h2 style={{ color: '#e2e8f0', fontSize: '1.5rem', marginBottom: '0.3rem', fontFamily: 'Montserrat, sans-serif' }}>
                        {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {mode === 'login' ? 'Sign in to your Rbotics account' : mode === 'register' ? 'Join the Rbotics community' : 'Enter your email to reset password'}
                    </p>
                </div>

                {/* Tab Toggle */}
                <div style={{
                    display: 'flex', background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px', padding: '4px', marginBottom: '1.5rem',
                }}>
                    {(['login', 'register'] as const).map(m => (
                        <button
                            key={m}
                            onClick={() => { setMode(m); clearErrors(); }}
                            style={{
                                flex: 1, padding: '0.6rem', border: 'none',
                                borderRadius: '10px', cursor: 'pointer',
                                fontWeight: 600, fontSize: '0.875rem',
                                transition: 'all 0.3s',
                                background: mode === m ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' : 'transparent',
                                color: mode === m ? '#fff' : '#64748b',
                                boxShadow: mode === m ? '0 4px 12px rgba(59,130,246,0.3)' : 'none',
                            }}
                        >
                            {m === 'login' ? 'Sign In' : 'Sign Up'}
                        </button>
                    ))}
                </div>

                {/* Feedback */}
                {error && (
                    <div style={{
                        background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem',
                        color: '#fca5a5', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                    }}>
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}
                {success && (
                    <div style={{
                        background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
                        borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem',
                        color: '#86efac', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                    }}>
                        <i className="fas fa-check-circle"></i> {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* ── SIGN IN ─────────────────────────────── */}
                    {mode === 'login' && (
                        <>
                            <Field label="Email or Mobile Number" icon="fa-user-circle">
                                <input
                                    type="text" required
                                    value={loginId}
                                    onChange={e => { setLoginId(e.target.value); clearErrors(); }}
                                    placeholder="you@example.com or +91 9876543210"
                                    style={inputStyle}
                                />
                            </Field>
                            <Field label="Password" icon="fa-lock" last>
                                <PasswordInput
                                    value={loginPassword}
                                    onChange={v => { setLoginPassword(v); clearErrors(); }}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </Field>
                            
                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                                <button type="button" className="btn btn-link p-0 text-decoration-none" style={{ color: '#3b82f6' }} onClick={() => {setMode('forgot_pwd'); clearErrors();}}>
                                    Forgot Password?
                                </button>
                            </div>
                        </>
                    )}


                    
                    {/* ── FORGOT PASSWORD ───────────────────────── */}
                    {mode === 'forgot_pwd' && (
                        <>
                            <Field label="Email or Mobile Number" icon="fa-user-circle">
                                <input
                                    type="text" required
                                    value={resetId}
                                    onChange={e => { setResetId(e.target.value); clearErrors(); }}
                                    placeholder="you@example.com or 9876543210"
                                    autoComplete="username"
                                    style={inputStyle}
                                />
                            </Field>

                            <Field label="New Password" icon="fa-lock">
                                <PasswordInput
                                    value={resetPassword1}
                                    onChange={v => { setResetPassword1(v); clearErrors(); }}
                                    placeholder="Create a strong password"
                                    autoComplete="new-password"
                                />
                            </Field>
                            <PasswordChecklist password={resetPassword1} />

                            <Field label="Confirm New Password" icon="fa-lock" last>
                                <PasswordInput
                                    value={resetConfirm}
                                    onChange={v => { setResetConfirm(v); clearErrors(); }}
                                    placeholder="Repeat new password"
                                    autoComplete="new-password"
                                />
                                <MatchHint password={resetPassword1} confirm={resetConfirm} />
                            </Field>

                            <SubmitButton loading={loading} icon="fa-key" label="Update Password" />

                            <div style={{ textAlign: 'center', margin: '1rem 0 0.5rem' }}>
                                <button type="button" className="btn btn-link p-0 text-decoration-none" style={{ color: '#94a3b8', fontSize: '0.85rem' }} onClick={() => {setMode('login'); clearErrors();}}>
                                    Back to sign in
                                </button>
                            </div>
                        </>
                    )}

                    {/* ── SIGN UP ─────────────────────────────── */}
                    {mode === 'register' && (
                        <>
                            <Field label="Full Name" icon="fa-user">
                                <input
                                    type="text" required
                                    value={regName}
                                    onChange={e => { setRegName(e.target.value); clearErrors(); }}
                                    placeholder="Your full name"
                                    style={inputStyle}
                                />
                            </Field>

                            {/* Email */}
                            <Field label="Email Address" icon="fa-envelope">
                                <input
                                    type="email"
                                    value={regEmail}
                                    onChange={e => { setRegEmail(e.target.value); clearErrors(); }}
                                    placeholder="you@example.com"
                                    style={inputStyle}
                                />
                            </Field>

                            {/* Mobile */}
                            <Field label="Mobile Number (optional)" icon="fa-phone">
                                <input
                                    type="tel"
                                    value={regMobile}
                                    onChange={e => { setRegMobile(e.target.value); clearErrors(); }}
                                    placeholder="+91 9876543210"
                                    style={inputStyle}
                                />
                            </Field>

                            <Field label="Password" icon="fa-lock">
                                <PasswordInput
                                    value={regPassword}
                                    onChange={v => { setRegPassword(v); clearErrors(); }}
                                    placeholder="Create a strong password"
                                    autoComplete="new-password"
                                />
                            </Field>
                            <PasswordChecklist password={regPassword} />
                            <Field label="Confirm Password" icon="fa-lock" last>
                                <PasswordInput
                                    value={regConfirm}
                                    onChange={v => { setRegConfirm(v); clearErrors(); }}
                                    placeholder="Repeat password"
                                    autoComplete="new-password"
                                />
                                <MatchHint password={regPassword} confirm={regConfirm} />
                            </Field>
                        </>
                    )}

                    {mode === 'login' && <SubmitButton loading={loading} icon="fa-sign-in-alt" label="Sign In" />}
                    {mode === 'register' && <SubmitButton loading={loading} icon="fa-user-plus" label="Create Account" />}
                    
                    {/* Delete account mock */}
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <button type="button" className="btn btn-link p-0 text-decoration-none" style={{ color: '#ef4444', fontSize: '0.8rem' }} onClick={() => handleMockAction('Account deletion requested. Support will contact you shortly.')}>
                            Request Account Deletion
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ── Submit button (shared by sign in / register / reset) ── */
const SubmitButton: React.FC<{ loading: boolean; icon: string; label: string }> = ({ loading, icon, label }) => (
    <button
        type="submit"
        disabled={loading}
        style={{
            width: '100%', padding: '0.85rem',
            background: loading ? '#334155' : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            border: 'none', borderRadius: '12px',
            color: '#fff', fontWeight: 700, fontSize: '0.95rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 8px 24px rgba(59,130,246,0.35)',
            transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            marginTop: '0.5rem',
        }}
    >
        {loading
            ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing…</>
            : <><i className={`fas ${icon}`}></i> {label}</>}
    </button>
);

/* ── Live password rule checklist ───────────────────── */
const PasswordChecklist: React.FC<{ password: string }> = ({ password }) => (
    <ul
        aria-label="Password requirements"
        style={{
            listStyle: 'none', padding: '0.6rem 0.8rem', margin: '-0.4rem 0 1rem',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.3rem 0.8rem',
        }}
    >
        {PASSWORD_RULES.map(rule => {
            const ok = rule.test(password);
            return (
                <li key={rule.label} style={{ fontSize: '0.75rem', color: ok ? '#4ade80' : '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <i className={`fas ${ok ? 'fa-check-circle' : 'fa-circle'}`} style={{ fontSize: ok ? '0.8rem' : '0.4rem', width: '0.8rem', textAlign: 'center' }}></i>
                    {rule.label}
                </li>
            );
        })}
    </ul>
);

/* ── "Passwords match / don't match" hint under confirm fields ── */
const MatchHint: React.FC<{ password: string; confirm: string }> = ({ password, confirm }) => {
    if (!confirm) return null;
    const ok = password === confirm;
    return (
        <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '0.3rem', fontSize: '0.75rem', color: ok ? '#4ade80' : '#f87171' }}>
            <i className={`fas ${ok ? 'fa-check' : 'fa-times'} me-1`}></i>
            {ok ? 'Passwords match' : 'Passwords do not match'}
        </div>
    );
};

/* ── Reusable field wrapper ─────────────────────────── */
const Field: React.FC<{ label: string; icon: string; last?: boolean; children: React.ReactNode }> = ({ label, icon, last, children }) => (
    <div style={{ marginBottom: last ? '1.5rem' : '1rem' }}>
        <label style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
            {label}
        </label>
        <div style={{ position: 'relative' }}>
            <i className={`fas ${icon}`} style={{
                position: 'absolute', left: '1rem', top: '50%',
                transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none',
            }}></i>
            {children}
        </div>
    </div>
);

/* ── Password input with show/hide toggle ───────────── */
const PasswordInput: React.FC<{
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    autoComplete?: string;
}> = ({ value, onChange, placeholder, autoComplete }) => {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <input
                type={visible ? 'text' : 'password'}
                required
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className="password-input"
                style={{ ...inputStyle, paddingRight: '2.8rem' }}
            />
            <button
                type="button"
                onClick={() => setVisible(v => !v)}
                aria-label={visible ? 'Hide password' : 'Show password'}
                title={visible ? 'Hide password' : 'Show password'}
                style={{
                    position: 'absolute', right: '0.5rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: visible ? '#3b82f6' : '#64748b',
                    cursor: 'pointer', padding: '0.4rem 0.5rem',
                    lineHeight: 1,
                }}
            >
                <i className={`fas ${visible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
        </>
    );
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.8rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
};

export default LoginPage;
