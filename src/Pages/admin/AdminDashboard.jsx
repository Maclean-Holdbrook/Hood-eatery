import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../services/api';
import socketService from '../../services/socket';
import Loading from '../../Components/Loading';
import { FaUsers, FaUtensils, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalMenuItems: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  useEffect(() => {
    loadDashboardData();

    socketService.connect();
    socketService.joinAdmin();

    socketService.onNewOrder(() => {
      loadDashboardData();
    });

    socketService.onOrderStatusUpdate(() => {
      loadDashboardData();
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const ordersRes = await ordersAPI.getOrderStats();

      setStats({
        totalCustomers: ordersRes.data.data?.totalUsers || 0,
        totalMenuItems: ordersRes.data.data?.totalMenuItems || 0,
        totalOrders: ordersRes.data.data?.totalOrders || 0
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      // Set default values if API fails
      setStats({
        totalCustomers: 0,
        totalMenuItems: 0,
        totalOrders: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return <Loading />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome to the admin panel</p>
        </div>
        <button onClick={handleLogout} className="admin-logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="dashboard-stats-list">
        <div className="dashboard-stat-card">
          <div className="stat-icon-wrapper">
            <FaUsers style={{ color: '#5b8fc7', fontSize: '3.5rem' }} />
          </div>
          <div className="stat-content">
            <div className="stat-label">TOTAL CUSTOMERS</div>
            <div className="stat-number">{stats.totalCustomers}</div>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon-wrapper">
            <FaCalendarAlt style={{ color: '#ff6b6b', fontSize: '3.5rem' }} />
          </div>
          <div className="stat-content">
            <div className="stat-label">TOTAL ORDERS</div>
            <div className="stat-number">{stats.totalOrders}</div>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon-wrapper">
            <FaUtensils style={{ color: '#ffd93d', fontSize: '3.5rem' }} />
          </div>
          <div className="stat-content">
            <div className="stat-label">MENU ITEMS</div>
            <div className="stat-number">{stats.totalMenuItems}</div>
          </div>
        </div>
      </div>

      <h2 className="dashboard-section-title">Quick Actions</h2>
      <div className="dashboard-actions-list">
        <Link to="/admin/users" className="dashboard-action-card">
          <div className="action-icon-wrapper">
            <FaUsers style={{ color: '#5b8fc7', fontSize: '3.5rem' }} />
          </div>
          <div className="action-content">
            <h3 className="action-title">Manage Customers</h3>
            <p className="action-description">View and manage registered customers</p>
          </div>
        </Link>

        <Link to="/admin/orders" className="dashboard-action-card">
          <div className="action-icon-wrapper">
            <FaCalendarAlt style={{ color: '#ff6b6b', fontSize: '3.5rem' }} />
          </div>
          <div className="action-content">
            <h3 className="action-title">Manage Orders</h3>
            <p className="action-description">View all orders and payment status</p>
          </div>
        </Link>

        <Link to="/admin/menu" className="dashboard-action-card">
          <div className="action-icon-wrapper">
            <FaUtensils style={{ color: '#ffd93d', fontSize: '3.5rem' }} />
          </div>
          <div className="action-content">
            <h3 className="action-title">Manage Menu</h3>
            <p className="action-description">Add, edit and manage food items</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
