import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useSelector((s) => ({
    isAuthenticated: Boolean(s.auth.user && s.auth.token),
    isAdmin: s.auth.user?.role === 'admin',
  }));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}
