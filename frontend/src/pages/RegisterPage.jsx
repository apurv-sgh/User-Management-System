import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
    background: '#fff',
  };

  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: '380px', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Shield size={24} style={{ color: 'hsl(221, 83%, 53%)' }} />
            <span style={{ fontWeight: 700, fontSize: '20px' }}>AdminCore</span>
          </div>
          <p style={{ fontSize: '13px', color: 'hsl(215.4, 16.3%, 46.9%)' }}>Create your account</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid hsl(214.3, 31.8%, 91.4%)', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '6px', fontSize: '13px' }}>
                {error}
              </div>
            )}
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="John Doe" required autoFocus />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} placeholder="you@example.com" required />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={inputStyle} placeholder="Min. 6 characters" required />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '10px', background: 'hsl(221, 83%, 53%)', color: '#fff',
                border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px',
              }}
            >
              {loading && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'hsl(215.4, 16.3%, 46.9%)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'hsl(221, 83%, 53%)', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
