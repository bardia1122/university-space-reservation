import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/layout/Layout';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Pages are code-split so the initial bundle stays small; Suspense shows a
// loading fallback while each route chunk is fetched on demand.

// Public pages
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

// Auth pages
const LoginPage = lazy(() =>
  import('./pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('./pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);

// Student pages
const DashboardPage = lazy(() =>
  import('./pages/student/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const SpacesPage = lazy(() =>
  import('./pages/student/SpacesPage').then((m) => ({ default: m.SpacesPage })),
);
const SpaceDetailPage = lazy(() =>
  import('./pages/student/SpaceDetailPage').then((m) => ({ default: m.SpaceDetailPage })),
);
const MyReservationsPage = lazy(() =>
  import('./pages/student/MyReservationsPage').then((m) => ({ default: m.MyReservationsPage })),
);
const SuggestionsPage = lazy(() =>
  import('./pages/student/SuggestionsPage').then((m) => ({ default: m.SuggestionsPage })),
);

// Admin pages
const AdminDashboardPage = lazy(() =>
  import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
);
const AdminReservationsPage = lazy(() =>
  import('./pages/admin/AdminReservationsPage').then((m) => ({ default: m.AdminReservationsPage })),
);
const AdminSpacesPage = lazy(() =>
  import('./pages/admin/AdminSpacesPage').then((m) => ({ default: m.AdminSpacesPage })),
);
const AdminComplaintsPage = lazy(() =>
  import('./pages/admin/AdminComplaintsPage').then((m) => ({ default: m.AdminComplaintsPage })),
);
const AdminAnalyticsPage = lazy(() =>
  import('./pages/admin/AdminAnalyticsPage').then((m) => ({ default: m.AdminAnalyticsPage })),
);
const AdminUsersPage = lazy(() =>
  import('./pages/admin/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage })),
);

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
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<HomePage />} />

        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Student routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spaces"
          element={
            <ProtectedRoute>
              <SpacesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spaces/:id"
          element={
            <ProtectedRoute>
              <SpaceDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-reservations"
          element={
            <ProtectedRoute>
              <MyReservationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suggestions"
          element={
            <ProtectedRoute>
              <SuggestionsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reservations"
          element={
            <AdminRoute>
              <AdminReservationsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/spaces"
          element={
            <AdminRoute>
              <AdminSpacesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <AdminRoute>
              <AdminComplaintsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <AdminAnalyticsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />

        {/* 404 — unknown routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
