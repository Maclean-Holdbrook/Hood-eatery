import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Don't show header on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>Hood Eatery</h1>
          </Link>

          <nav className="nav">
            <Link to="/menu" className="nav-link">Menu</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            {user && user.role !== 'admin' && (
              <Link to="/my-orders" className="nav-link">My Orders</Link>
            )}
          </nav>

          <div className="header-actions">
            {user ? (
              <div className="user-menu">
                <span className="user-name">
                  <FaUser /> {user.fullName}
                </span>
                <button onClick={logout} className="btn-logout">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
