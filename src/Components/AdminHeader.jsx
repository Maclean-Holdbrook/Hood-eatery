import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaTachometerAlt, FaUtensils, FaShoppingBag } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './AdminHeader.css';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <Link to="/admin" className="admin-logo">
          <h1>Hood Eatery Admin</h1>
        </Link>

        <nav className="admin-nav">
          <Link to="/admin" className={`admin-nav-link ${isActive('/admin')}`}>
            <FaTachometerAlt /> Dashboard
          </Link>
          <Link to="/admin/menu" className={`admin-nav-link ${isActive('/admin/menu')}`}>
            <FaUtensils /> Menu Management
          </Link>
          <Link to="/admin/orders" className={`admin-nav-link ${isActive('/admin/orders')}`}>
            <FaShoppingBag /> Orders
          </Link>
        </nav>

        <div className="admin-user-menu">
          <span className="admin-user-name">
            <FaUser /> {user?.fullName}
          </span>
          <button onClick={logout} className="admin-btn-logout">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
