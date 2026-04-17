import { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, UserCheck, UserX, Shield, Activity } from 'lucide-react';
import { format } from 'date-fns';

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid hsl(214.3, 31.8%, 91.4%)', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'hsl(215.4, 16.3%, 46.9%)' }}>{title}</span>
        <Icon size={16} style={{ color: 'hsl(215.4, 16.3%, 46.9%)' }} />
      </div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: 'hsl(222.2, 84%, 4.9%)', marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '12px', color: 'hsl(215.4, 16.3%, 46.9%)' }}>{subtitle}</div>
    </div>
  );
} 

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [roleDist, setRoleDist] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, roleRes, activityRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/role-distribution'),
          api.get('/dashboard/recent-activity?limit=10'),
        ]);
        setStats(statsRes.data);
        setRoleDist(roleRes.data);
        setActivity(activityRes.data);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid hsl(214.3, 31.8%, 91.4%)', borderTopColor: 'hsl(221, 83%, 53%)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const total = stats?.totalUsers || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>Dashboard Overview</h1>
        <p style={{ fontSize: '13px', color: 'hsl(215.4, 16.3%, 46.9%)' }}>Key metrics and recent activity across the organization</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <StatCard title="Total Users" value={stats?.totalUsers || 0} subtitle={`+${stats?.newUsersThisMonth || 0} new this month`} icon={Users} />
        <StatCard title="Active Accounts" value={stats?.activeUsers || 0} subtitle={`${Math.round(((stats?.activeUsers || 0) / total) * 100)}% of total`} icon={UserCheck} />
        <StatCard title="Administrators" value={stats?.adminCount || 0} subtitle="Highly privileged accounts" icon={Shield} />
        <StatCard title="Inactive Accounts" value={stats?.inactiveUsers || 0} subtitle="Suspended or deactivated" icon={UserX} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        {/* Recent Activity */}
        <div style={{ background: '#fff', border: '1px solid hsl(214.3, 31.8%, 91.4%)', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid hsl(214.3, 31.8%, 91.4%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={15} />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Recent Activity</span>
          </div>
          <div style={{ padding: '4px 0' }}>
            {activity.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'hsl(215.4, 16.3%, 46.9%)', fontSize: '13px' }}>No recent activity</div>
            ) : (
              activity.map((item, i) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 20px', borderBottom: i < activity.length - 1 ? '1px solid hsl(214.3, 31.8%, 96%)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '2px', textTransform: 'capitalize' }}>
                      {item.action.replace(/_/g, ' ').toLowerCase()}
                    </div>
                    <div style={{ fontSize: '12px', color: 'hsl(215.4, 16.3%, 46.9%)' }}>
                      {item.performedBy} → <span style={{ color: 'hsl(222.2, 84%, 20%)' }}>{item.targetUser}</span>
                    </div>
                    {item.details && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px', background: '#f8fafc', padding: '2px 6px', borderRadius: '3px', display: 'inline-block' }}>{item.details}</div>}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0 }}>
                    {format(new Date(item.timestamp), 'MMM d, h:mm a')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Role Distribution */}
        <div style={{ background: '#fff', border: '1px solid hsl(214.3, 31.8%, 91.4%)', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid hsl(214.3, 31.8%, 91.4%)' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Role Distribution</span>
          </div>
          <div style={{ padding: '20px' }}>
            {[
              { label: 'Admin', key: 'admin', color: '#ef4444' },
              { label: 'Manager', key: 'manager', color: 'hsl(221, 83%, 53%)' },
              { label: 'User', key: 'user', color: '#94a3b8' },
            ].map(({ label, key, color }) => (
              <div key={key} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{label}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: 'hsl(215.4, 16.3%, 46.9%)' }}>{roleDist?.[key] || 0}</span>
                </div>
                <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: color, width: `${((roleDist?.[key] || 0) / total) * 100}%`, transition: 'width 0.6s ease', borderRadius: '99px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
