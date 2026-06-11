import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/layout/Layout';

// Public pages
import { HomePage } from './pages/HomePage';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Student pages
import { DashboardPage } from './pages/student/DashboardPage';
import { SpacesPage } from './pages/student/SpacesPage';
import { SpaceDetailPage } from './pages/student/SpaceDetailPage';
import { MyReservationsPage } from './pages/student/MyReservationsPage';
import { SuggestionsPage } from './pages/student/SuggestionsPage';

// Admin pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminReservationsPage } from './pages/admin/AdminReservationsPage';
import { AdminSpacesPage } from './pages/admin/AdminSpacesPage';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const [searchParams] = useSearchParams();
  if (isAuthenticated) {
    // Honor a post-login redirect target (e.g. a space the user wanted to reserve)
    const next = searchParams.get('next');
    return <Navigate to={next ?? (isAdmin ? '/admin' : '/dashboard')} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<HomePage />} />

      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Student routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/spaces" element={<ProtectedRoute><SpacesPage /></ProtectedRoute>} />
      <Route path="/spaces/:id" element={<ProtectedRoute><SpaceDetailPage /></ProtectedRoute>} />
      <Route path="/my-reservations" element={<ProtectedRoute><MyReservationsPage /></ProtectedRoute>} />
      <Route path="/suggestions" element={<ProtectedRoute><SuggestionsPage /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/reservations" element={<AdminRoute><AdminReservationsPage /></AdminRoute>} />
      <Route path="/admin/spaces" element={<AdminRoute><AdminSpacesPage /></AdminRoute>} />
      <Route path="/admin/complaints" element={<AdminRoute><AdminComplaintsPage /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><AdminAnalyticsPage /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
