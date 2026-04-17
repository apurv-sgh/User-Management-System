import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';

// Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { UsersPage } from './pages/UsersPage';
import { UserDetailPage } from './pages/UserDetailPage';
import { CreateUserPage } from './pages/CreateUserPage';
import { EditUserPage } from './pages/EditUserPage';
import { NotFoundPage, UnauthorizedPage } from './pages/ErrorPages';

// Styles
import './styles/index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div id="root-layout">
          <Navbar />
          <main>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePasswordPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin/Manager routes */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredRole={['Admin', 'Manager']}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/create"
                element={
                  <ProtectedRoute requiredRole={['Admin']}>
                    <CreateUserPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/:userId"
                element={
                  <ProtectedRoute requiredRole={['Admin', 'Manager']}>
                    <UserDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/:userId/edit"
                element={
                  <ProtectedRoute>
                    <EditUserPage />
                  </ProtectedRoute>
                }
              />

              {/* Error routes */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/404" element={<NotFoundPage />} />

              {/* Redirect root to dashboard or login */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Catch all - 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
