import React from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { Alert } from '../components/Alert';
import styles from '../styles/Pages.module.css';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.role === 'Admin') {
          const data = await userService.getUserStats();
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.role]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Welcome, {user?.name}!</h1>
        <p className={styles.roleInfo}>
          Role: <strong>{user?.role}</strong>
        </p>

        {error && (
          <Alert
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        )}

        {user?.role === 'Admin' && (
          <div className={styles.dashboard}>
            <div className={styles.header}>
              <h2>📊 Dashboard Overview</h2>
            </div>

            {loading ? (
              <div className={styles.loading}>Loading statistics...</div>
            ) : stats ? (
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>👥</div>
                  <div className={styles.statContent}>
                    <h3>Total Users</h3>
                    <p className={styles.statNumber}>{stats.totalUsers}</p>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>✅</div>
                  <div className={styles.statContent}>
                    <h3>Active Users</h3>
                    <p className={styles.statNumber}>{stats.activeUsers}</p>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>❌</div>
                  <div className={styles.statContent}>
                    <h3>Inactive Users</h3>
                    <p className={styles.statNumber}>{stats.inactiveUsers}</p>
                  </div>
                </div>

                {stats.byRole && stats.byRole.length > 0 && (
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>🎯</div>
                    <div className={styles.statContent}>
                      <h3>Users by Role</h3>
                      <div className={styles.roleBreakdown}>
                        {stats.byRole.map((role) => (
                          <div key={role._id} className={styles.roleItem}>
                            <span>{role._id}:</span> <strong>{role.count}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <div className={styles.quickActions}>
              <h3>Quick Actions</h3>
              <a href="/users" className={styles.actionLink}>
                📋 View All Users
              </a>
              <a href="/users/create" className={styles.actionLink}>
                ➕ Create New User
              </a>
            </div>
          </div>
        )}

        {user?.role === 'Manager' && (
          <div className={styles.dashboard}>
            <div className={styles.header}>
              <h2>📊 Manager Dashboard</h2>
            </div>
            <p>As a Manager, you can view and manage non-admin users.</p>
            <div className={styles.quickActions}>
              <a href="/users" className={styles.actionLink}>
                📋 View All Users
              </a>
            </div>
          </div>
        )}

        {user?.role === 'User' && (
          <div className={styles.dashboard}>
            <div className={styles.header}>
              <h2>👤 User Dashboard</h2>
            </div>
            <p>Manage your profile and account settings.</p>
            <div className={styles.quickActions}>
              <a href="/profile" className={styles.actionLink}>
                👤 My Profile
              </a>
              <a href="/change-password" className={styles.actionLink}>
                🔐 Change Password
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
