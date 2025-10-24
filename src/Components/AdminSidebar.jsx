import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUtensils, FaShoppingBag, FaUsers, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBackToSite = () => {
    navigate('/');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h1>Admin Panel</h1>
      </div>

      <nav className="admin-sidebar-nav">
        <Link to="/admin" className={`admin-sidebar-link ${isActive('/admin')}`}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </Link>

        <Link to="/admin/users" className={`admin-sidebar-link ${isActive('/admin/users')}`}>
          <FaUsers />
          <span>Customers</span>
        </Link>

        <Link to="/admin/menu" className={`admin-sidebar-link ${isActive('/admin/menu')}`}>
          <FaUtensils />
          <span>Menu Items</span>
        </Link>

        <Link to="/admin/orders" className={`admin-sidebar-link ${isActive('/admin/orders')}`}>
          <FaShoppingBag />
          <span>Orders</span>
        </Link>
      </nav>

      <div className="admin-sidebar-footer">
        <button onClick={handleBackToSite} className="admin-sidebar-link">
          <FaArrowLeft />
          <span>Back to Site</span>
        </button>

        <button onClick={handleLogout} className="admin-sidebar-link">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
