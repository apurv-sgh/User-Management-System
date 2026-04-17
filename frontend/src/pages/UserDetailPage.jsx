import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Loader2, User as UserIcon, Mail, Shield, Clock } from 'lucide-react';
import { format } from 'date-fns';

const inputStyle = { width: '100%', padding: '8px 11px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13.5px', outline: 'none', background: '#fff' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '5px' };

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'user', status: 'active' });

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(res => { setUser(res.data); setForm({ name: res.data.name, email: res.data.email, role: res.data.role, status: res.data.status }); })
      .catch(err => setError(err.response?.data?.error || 'User not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const canManage = () => {
    if (!user) return false;
    if (currentUser?.role === 'admin') return true;
    if (currentUser?.role === 'manager' && user.role !== 'admin') return true;
    return false;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const { data } = await api.put(`/users/${id}`, form);
      setUser(data);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'User updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update user.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
      <Loader2 size={24} style={{ animation: 'spin 0.8s linear infinite', color: '#94a3b8' }} />
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', paddingTop: '80px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>User not found</h2>
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>{error}</p>
      <button onClick={() => navigate('/users')} style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13.5px', cursor: 'pointer', background: '#fff', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <ArrowLeft size={14} /> Back to Users
      </button>
    </div>
  );

  const infoRow = (Icon, label, value) => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', marginBottom: '3px' }}><Icon size={13} />{label}</div>
      <div style={{ fontSize: '14px', fontWeight: 500 }}>{value}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button onClick={() => navigate('/users')} style={{ padding: '7px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={16} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 700 }}>{user?.name}</h1>
            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, background: user?.status === 'active' ? '#f0fdf4' : '#f8fafc', color: user?.status === 'active' ? '#166534' : '#475569', border: `1px solid ${user?.status === 'active' ? '#bbf7d0' : '#e2e8f0'}` }}>
              {user?.status}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b' }}>{user?.email}</p>
        </div>
        {canManage() && !isEditing && (
          <button onClick={() => setIsEditing(true)} style={{ padding: '9px 18px', background: 'hsl(221, 83%, 53%)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>
            Edit User
          </button>
        )}
      </div>

      {message && (
        <div style={{ padding: '10px 14px', borderRadius: '6px', fontSize: '13px', background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`, color: message.type === 'success' ? '#166534' : '#b91c1c' }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        {/* Main card */}
        <div style={{ background: '#fff', border: '1px solid hsl(214.3, 31.8%, 91.4%)', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Profile Details</h2>
          <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '24px' }}>Basic information about this user account</p>

          {isEditing ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div><label style={labelStyle}>Name</label><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div><label style={labelStyle}>Email</label><input type="email" style={inputStyle} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                <div>
                  <label style={labelStyle}>Role</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} disabled={currentUser?.role !== 'admin'}>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                  </select>
                  {currentUser?.role !== 'admin' && <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Only admins can change roles.</p>}
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => { setIsEditing(false); setForm({ name: user.name, email: user.email, role: user.role, status: user.status }); }} style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13.5px', cursor: 'pointer', background: '#fff' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: '8px 16px', background: 'hsl(221, 83%, 53%)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13.5px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.75 : 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {saving && <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} />} Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {infoRow(UserIcon, 'Full Name', user?.name)}
              {infoRow(Mail, 'Email Address', user?.email)}
              {infoRow(Shield, 'Role', <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>)}
              {infoRow(Clock, 'Member Since', format(new Date(user?.createdAt), 'MMMM d, yyyy'))}
            </div>
          )}
        </div>

        {/* Audit card */}
        <div style={{ background: '#fff', border: '1px solid hsl(214.3, 31.8%, 91.4%)', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '13.5px', fontWeight: 600, marginBottom: '20px' }}>Audit Information</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
            <div>
              <div style={{ color: '#64748b', marginBottom: '4px' }}>Created</div>
              <div style={{ fontWeight: 500 }}>{format(new Date(user?.createdAt), 'MMM d, yyyy h:mm a')}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>by {user?.createdByName || 'System'}</div>
            </div>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <div style={{ color: '#64748b', marginBottom: '4px' }}>Last Updated</div>
              <div style={{ fontWeight: 500 }}>{format(new Date(user?.updatedAt), 'MMM d, yyyy h:mm a')}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>by {user?.updatedByName || 'System'}</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
