// Convenience hook for reading auth state from the Redux store.
import { useSelector } from 'react-redux';

export default function useAuth() {
  const { user, token, status, error } = useSelector((s) => s.auth);
  return {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === 'admin',
    status,
    error,
  };
}
