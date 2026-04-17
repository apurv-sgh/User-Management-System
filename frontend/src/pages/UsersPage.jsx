import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, MoreHorizontal, Loader2, Filter, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const ROLE_COLORS = {
  admin: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  manager: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  user: { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
};

const STATUS_COLORS = {
  active: { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  inactive: { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
};

function Badge({ text, type = 'role' }) {
  const colors = type === 'role' ? ROLE_COLORS[text] : STATUS_COLORS[text];
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 500, background: colors?.bg, color: colors?.color, border: `1px solid ${colors?.border}`, textTransform: 'capitalize' }}>
      {text}
    </span>
  );
}

export default function UsersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'user', status: 'active' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('status', statusFilter);
      const { data } = await api.get(`/users?${params}`);
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, search, roleFilter, statusFilter]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try { await api.delete(`/users/${id}`); fetchUsers(); } catch (err) { alert(err.response?.data?.error || 'Failed to delete user'); }
  };
  const canManage = (targetRole) => user?.role === 'admin' || (user?.role === 'manager' && targetRole !== 'admin');

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);
    try {
      await api.post('/users', createForm);
      setShowCreate(false);
      setCreateForm({ name: '', email: '', password: '', role: 'user', status: 'active' });
      fetchUsers();
    } catch (err) {
      setCreateError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const selectStyle = { padding: '7px 10px', border: '1px solid hsl(214.3, 31.8%, 85%)', borderRadius: '6px', fontSize: '13px', background: '#fff', cursor: 'pointer', outline: 'none' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Users</h1>
          <p style={{ fontSize: '13px', color: 'hsl(215.4, 16.3%, 46.9%)' }}>Manage user accounts and roles</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowCreate(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: 'hsl(221, 83%, 53%)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus size={15} /> Add User
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', border: '1px solid hsl(214.3, 31.8%, 91.4%)', borderRadius: '8px', padding: '14px 16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '220px', maxWidth: '380px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by name or email..."
              style={{ width: '100%', padding: '7px 10px 7px 32px', border: '1px solid hsl(214.3, 31.8%, 85%)', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <button type="submit" style={{ padding: '7px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}>Search</button>
        </form>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} style={selectStyle}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={selectStyle}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid hsl(214.3, 31.8%, 91.4%)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }} onClick={() => setOpenMenu(null)}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: h === 'Actions' ? 'right' : 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid hsl(214.3, 31.8%, 91.4%)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '48px', textAlign: 'center' }}>
                <Loader2 size={20} style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block', color: '#94a3b8' }} />
              </td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No users found</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid hsl(214.3, 31.8%, 96%)' }}
                  onMouseOver={e => e.currentTarget.style.background = '#fafbfc'}
                  onMouseOut={e => e.currentTarget.style.background = '#fff'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 500, fontSize: '13.5px' }}>{u.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}><Badge text={u.role} type="role" /></td>
                  <td style={{ padding: '12px 16px' }}><Badge text={u.status} type="status" /></td>
                  <td style={{ padding: '12px 16px', fontSize: '12.5px', color: '#64748b' }}>{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <button onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === u.id ? null : u.id); }} style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '4px', color: '#64748b' }}>
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenu === u.id && (
                        <div style={{ position: 'absolute', right: 0, top: '100%', zIndex: 50, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: '140px', padding: '4px' }} onClick={e => e.stopPropagation()}>
                          <button onClick={() => navigate(`/users/${u.id}`)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', borderRadius: '5px', textAlign: 'left' }}
                            onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                            <Edit size={13} /> View Details
                          </button>
                          {canManage(u.role) && (
                            <button onClick={() => handleDelete(u.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', borderRadius: '5px', color: '#dc2626', textAlign: 'left' }}
                              onMouseOver={e => e.currentTarget.style.background = '#fef2f2'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                              <Trash2 size={13} /> Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid hsl(214.3, 31.8%, 91.4%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', cursor: page === 1 ? 'not-allowed' : 'pointer', background: '#fff', opacity: page === 1 ? 0.5 : 1 }}>Previous</button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', cursor: page >= totalPages ? 'not-allowed' : 'pointer', background: '#fff', opacity: page >= totalPages ? 0.5 : 1 }}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowCreate(false)}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '20px' }}>Create New User</h2>
            {createError && <div style={{ marginBottom: '16px', padding: '10px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '13px', color: '#b91c1c' }}>{createError}</div>}
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[{ label: 'Name', key: 'name', type: 'text' }, { label: 'Email', key: 'email', type: 'email' }, { label: 'Password', key: 'password', type: 'password' }].map(({ label, key, type }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '5px' }}>{label}</label>
                  <input type={type} value={createForm[key]} onChange={e => setCreateForm(f => ({ ...f, [key]: e.target.value }))} required style={{ width: '100%', padding: '8px 11px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13.5px', outline: 'none' }} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '5px' }}>Role</label>
                  <select value={createForm.role} onChange={e => setCreateForm(f => ({ ...f, role: e.target.value }))} style={{ width: '100%', padding: '8px 11px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13.5px', outline: 'none', background: '#fff' }}>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '5px' }}>Status</label>
                  <select value={createForm.status} onChange={e => setCreateForm(f => ({ ...f, status: e.target.value }))} style={{ width: '100%', padding: '8px 11px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13.5px', outline: 'none', background: '#fff' }}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowCreate(false)} style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13.5px', cursor: 'pointer', background: '#fff' }}>Cancel</button>
                <button type="submit" disabled={creating} style={{ padding: '8px 16px', background: 'hsl(221, 83%, 53%)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13.5px', fontWeight: 600, cursor: creating ? 'not-allowed' : 'pointer', opacity: creating ? 0.75 : 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {creating && <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} />} Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
