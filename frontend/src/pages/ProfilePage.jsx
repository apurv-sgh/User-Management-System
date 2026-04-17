import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1px solid hsl(214.3, 31.8%, 85%)',
  borderRadius: '6px', fontSize: '14px', outline: 'none', background: '#fff',
};

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' };

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', currentPassword: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get('/profile').then(res => {
      setProfile(res.data);
      setForm(f => ({ ...f, name: res.data.name }));
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    const payload = { name: form.name };
    if (form.password) {
      if (!form.currentPassword) {
        setMessage({ type: 'error', text: 'Current password is required to set a new password' });
        return;
      }
      if (form.password.length < 6) {
        setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
        return;
      }
      payload.password = form.password;
      payload.currentPassword = form.currentPassword;
    }
    setSaving(true);
    try {
      const { data } = await api.put('/profile', payload);
      setProfile(data);
      updateUser(data);
      setForm(f => ({ ...f, currentPassword: '', password: '' }));
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}><Loader2 size={24} style={{ animation: 'spin 0.8s linear infinite' }} /></div>;
  }

  return (
    <div style={{ maxWidth: '560px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Your Profile</h1>
        <p style={{ fontSize: '13px', color: 'hsl(215.4, 16.3%, 46.9%)' }}>Manage your personal information and password</p>
      </div>

      <div style={{ background: '#fff', border: '1px solid hsl(214.3, 31.8%, 91.4%)', borderRadius: '10px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {/* Avatar info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid hsl(214.3, 31.8%, 91.4%)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'hsl(221, 83%, 95%)', color: 'hsl(221, 83%, 53%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, flexShrink: 0 }}>
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px' }}>{profile?.name}</div>
            <div style={{ fontSize: '13px', color: 'hsl(215.4, 16.3%, 46.9%)', marginTop: '2px' }}>{profile?.email}</div>
            <span style={{ display: 'inline-block', marginTop: '6px', background: '#f1f5f9', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: 500, textTransform: 'capitalize', color: '#475569' }}>{profile?.role}</span>
          </div>
        </div>

        {message && (
          <div style={{ marginBottom: '20px', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`, color: message.type === 'success' ? '#166534' : '#b91c1c' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>

          <div style={{ paddingTop: '16px', borderTop: '1px solid hsl(214.3, 31.8%, 91.4%)' }}>
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Change Password</div>
            <div style={{ fontSize: '12px', color: 'hsl(215.4, 16.3%, 46.9%)', marginBottom: '16px' }}>Leave blank if you don't want to change your password.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Current Password</label>
                <input type="password" style={inputStyle} placeholder="••••••••" value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>New Password</label>
                <input type="password" style={inputStyle} placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={saving}
              style={{ padding: '9px 20px', background: 'hsl(221, 83%, 53%)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.75 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {saving && <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
