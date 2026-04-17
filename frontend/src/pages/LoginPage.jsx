import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Loader2 } from 'lucide-react';
import { getErrorMessage } from '../utils/errorHandler';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'user' ? '/profile' : '/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid hsl(214.3, 31.8%, 85%)',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s',
    background: '#fff',
  };

  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: 'hsl(222.2, 84%, 15%)' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '0 16px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Shield size={24} style={{ color: 'hsl(221, 83%, 53%)' }} />
            <span style={{ fontWeight: 700, fontSize: '20px', color: 'hsl(222.2, 84%, 4.9%)' }}>AdminCore</span>
          </div>
          <p style={{ fontSize: '13px', color: 'hsl(215.4, 16.3%, 46.9%)' }}>Sign in to your account</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid hsl(214.3, 31.8%, 91.4%)', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '6px', fontSize: '13px' }}>
                {error}
              </div>
            )}
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={inputStyle}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={inputStyle}
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                background: 'hsl(221, 83%, 53%)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '4px',
              }}
            >
              {loading && <Loader2 size={15} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'hsl(215.4, 16.3%, 46.9%)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'hsl(221, 83%, 53%)', fontWeight: 500, textDecoration: 'none' }}>
            Register
          </Link>
        </div>

        <div style={{ marginTop: '24px', background: '#f1f5f9', borderRadius: '8px', padding: '12px 14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Test Accounts</div>
          {[
            { label: 'Admin', email: 'admin@example.com', password: 'Admin123!' },
            { label: 'Manager', email: 'manager@example.com', password: 'Manager123!' },
            { label: 'User', email: 'john@example.com', password: 'User123!' },
          ].map(acc => (
            <div
              key={acc.email}
              onClick={() => setForm({ email: acc.email, password: acc.password })}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 4px', cursor: 'pointer', borderRadius: '4px' }}
              onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>{acc.label}</span>
              <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>{acc.email}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
