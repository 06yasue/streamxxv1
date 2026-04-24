"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                setStatus({ type: 'success', msg: 'Access Granted. Redirecting...' });
                setTimeout(() => router.push('/list'), 1500);
            } else {
                setStatus({ type: 'error', msg: 'Invalid credentials. Please try again.' });
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'Something went wrong.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: '"Jost", sans-serif' }}>
            <div style={{ width: '100%', maxWidth: '400px', background: '#141414', padding: '40px 30px', border: '1px solid #222', borderRadius: '4px' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <span className="material-icons notranslate" style={{ fontSize: '48px', color: '#e50914', marginBottom: '10px' }}>lock_person</span>
                    <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '800', margin: 0, letterSpacing: '1px' }}>ADMIN ACCESS</h1>
                    <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>Please sign in to manage your content</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ color: '#aaa', fontSize: '13px', fontWeight: '600' }}>EMAIL ADDRESS</label>
                        <input 
                            type="email" 
                            required 
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ background: '#1a1a1a', border: '1px solid #333', padding: '12px 15px', color: '#fff', borderRadius: '4px', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ color: '#aaa', fontSize: '13px', fontWeight: '600' }}>PASSWORD</label>
                        <input 
                            type="password" 
                            required 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ background: '#1a1a1a', border: '1px solid #333', padding: '12px 15px', color: '#fff', borderRadius: '4px', outline: 'none' }}
                        />
                    </div>

                    <button 
                        disabled={loading}
                        type="submit"
                        style={{ 
                            background: loading ? '#555' : '#e50914', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '14px', 
                            fontSize: '15px', 
                            fontWeight: 'bold', 
                            borderRadius: '4px', 
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '10px',
                            transition: '0.3s'
                        }}
                    >
                        {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
                    </button>

                    {/* CUSTOM NOTIFICATION (No Alert JS) */}
                    {status.msg && (
                        <div style={{ 
                            padding: '12px', 
                            borderRadius: '4px', 
                            fontSize: '13px', 
                            textAlign: 'center',
                            background: status.type === 'success' ? 'rgba(29, 185, 84, 0.1)' : 'rgba(229, 9, 20, 0.1)',
                            color: status.type === 'success' ? '#1db954' : '#e50914',
                            border: `1px solid ${status.type === 'success' ? '#1db954' : '#e50914'}`,
                        }}>
                            {status.msg}
                        </div>
                    )}
                </form>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <a href="/" style={{ color: '#555', textDecoration: 'none', fontSize: '13px' }}>&larr; Back to Homepage</a>
                </div>

            </div>
        </div>
    );
}
