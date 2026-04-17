import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, User, LogOut, Shield } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    ...(user?.role === 'admin' || user?.role === 'manager'
      ? [
          { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/users', icon: Users, label: 'Users' },
        ]
      : []),
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: 'var(--sidebar-bg)',
        color: 'var(--sidebar-fg)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} style={{ color: 'hsl(221, 83%, 53%)' }} />
            <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.01em' }}>AdminCore</span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.02em' }}>
            USER MANAGEMENT
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '13.5px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                marginBottom: '2px',
                transition: 'all 0.15s ease',
              })}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ padding: '10px 12px', marginBottom: '4px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', marginBottom: '2px' }}>{user?.name}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 12px',
              borderRadius: '6px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.5)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13.5px',
              textAlign: 'left',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 28px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
