import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    // Save the intended destination before redirecting to login
    const intendedPath = location.pathname + location.search;
    sessionStorage.setItem('intendedPath', intendedPath);

    // Redirect to admin login for admin routes, regular login for customer routes
    return <Navigate to={adminOnly ? "/admin/login" : "/login"} replace />;
  }

  if (adminOnly && !isAdmin()) {
    // If user is logged in but not an admin, redirect to admin login
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default PrivateRoute;
