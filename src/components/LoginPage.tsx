import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
    onClose?: () => void;
    onSuccess?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onClose, onSuccess }) => {
    const { login, register } = useAuth();
    const [mode, setMode] = useState<'login' | 'register'>('login');

    // Login: can enter email or mobile
    const [loginId, setLoginId] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register fields
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regMobile, setRegMobile] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const clearErrors = () => { setError(''); setSuccess(''); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        clearErrors();
        await new Promise(r => setTimeout(r, 600));

        if (mode === 'login') {
            const res = login(loginId.trim(), loginPassword);
            if (res.success) {
                setSuccess(res.message);
                setTimeout(() => {
                    onClose?.();
                    onSuccess?.();
                }, 800);
            } else {
                setError(res.message);
            }
        } else {
            // Register validations
            if (!regEmail && !regMobile) {
                setError('Please provide at least an email or mobile number.');
                setLoading(false);
                return;
            }
            if (regEmail && !/\S+@\S+\.\S+/.test(regEmail)) {
                setError('Enter a valid email address.');
                setLoading(false);
                return;
            }
            if (regMobile && !/^[+]?[0-9\s\-]{7,15}$/.test(regMobile)) {
                setError('Enter a valid mobile number.');
                setLoading(false);
                return;
            }
            if (regPassword !== regConfirm) {
                setError('Passwords do not match.');
                setLoading(false);
                return;
            }
            if (regPassword.length < 6) {
                setError('Password must be at least 6 characters.');
                setLoading(false);
                return;
            }
            const res = register(regName, regEmail, regMobile, regPassword);
            if (res.success) {
                setSuccess(res.message);
                setTimeout(() => {
                    onClose?.();
                    onSuccess?.();
                }, 800);
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
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {mode === 'login' ? 'Sign in to your Rbotics account' : 'Join the Rbotics community'}
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
                                <input
                                    type="password" required
                                    value={loginPassword}
                                    onChange={e => { setLoginPassword(e.target.value); clearErrors(); }}
                                    placeholder="••••••••"
                                    style={inputStyle}
                                />
                            </Field>
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

                            {/* OR divider */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                margin: '0.5rem 0',
                            }}>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                                <span style={{
                                    color: '#475569', fontSize: '0.75rem', fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '20px', padding: '0.2rem 0.75rem',
                                }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                            </div>

                            {/* Mobile */}
                            <Field label="Mobile Number" icon="fa-mobile-alt">
                                <input
                                    type="tel"
                                    value={regMobile}
                                    onChange={e => { setRegMobile(e.target.value); clearErrors(); }}
                                    placeholder="+91 9876543210"
                                    pattern="[+]?[0-9\s\-]{7,15}"
                                    style={inputStyle}
                                />
                            </Field>

                            <div style={{
                                background: 'rgba(6,182,212,0.08)',
                                border: '1px solid rgba(6,182,212,0.2)',
                                borderRadius: '8px', padding: '0.6rem 0.9rem',
                                fontSize: '0.78rem', color: '#67e8f9',
                                marginBottom: '1rem',
                                display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                            }}>
                                <i className="fas fa-info-circle" style={{ marginTop: '0.1rem', flexShrink: 0 }}></i>
                                <span>Provide at least one — <strong>email</strong> or <strong>mobile</strong> — to create your account. You can also add both.</span>
                            </div>

                            <Field label="Password" icon="fa-lock">
                                <input
                                    type="password" required
                                    value={regPassword}
                                    onChange={e => { setRegPassword(e.target.value); clearErrors(); }}
                                    placeholder="Min. 6 characters"
                                    style={inputStyle}
                                />
                            </Field>
                            <Field label="Confirm Password" icon="fa-lock" last>
                                <input
                                    type="password" required
                                    value={regConfirm}
                                    onChange={e => { setRegConfirm(e.target.value); clearErrors(); }}
                                    placeholder="Repeat password"
                                    style={inputStyle}
                                />
                            </Field>
                        </>
                    )}

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
                            : <>{mode === 'login' ? <><i className="fas fa-sign-in-alt"></i> Sign In</> : <><i className="fas fa-user-plus"></i> Create Account</>}</>
                        }
                    </button>
                </form>
            </div>
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
