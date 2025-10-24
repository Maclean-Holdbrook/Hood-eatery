import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../../services/api';
import socketService from '../../services/socket';
import Loading from '../../Components/Loading';
import { FaUsers, FaUtensils, FaCalendarAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalMenuItems: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);

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
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-subtitle">Welcome to the admin panel</p>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FaUsers style={{ color: '#5b4fc7', fontSize: '3rem' }} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-label">Total Customers</div>
            <div className="admin-stat-value">{stats.totalCustomers}</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FaUtensils style={{ color: '#ffd700', fontSize: '3rem' }} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-label">Menu Items</div>
            <div className="admin-stat-value">{stats.totalMenuItems}</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FaCalendarAlt style={{ color: '#5b9aff', fontSize: '3rem' }} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-label">Total Orders</div>
            <div className="admin-stat-value">{stats.totalOrders}</div>
          </div>
        </div>
      </div>

      <h2 className="admin-section-title">Quick Actions</h2>
      <div className="admin-actions-grid">
        <Link to="/admin/users" className="admin-action-card">
          <div className="admin-action-icon">
            <FaUsers style={{ color: '#5b4fc7', fontSize: '3rem' }} />
          </div>
          <h3 className="admin-action-title">Manage Customers</h3>
          <p className="admin-action-description">
            View and manage registered customers
          </p>
        </Link>

        <Link to="/admin/orders" className="admin-action-card">
          <div className="admin-action-icon">
            <FaCalendarAlt style={{ color: '#5b9aff', fontSize: '3rem' }} />
          </div>
          <h3 className="admin-action-title">Manage Orders</h3>
          <p className="admin-action-description">
            View all orders and payment status
          </p>
        </Link>

        <Link to="/admin/menu" className="admin-action-card">
          <div className="admin-action-icon">
            <FaUtensils style={{ color: '#ffd700', fontSize: '3rem' }} />
          </div>
          <h3 className="admin-action-title">Manage Menu</h3>
          <p className="admin-action-description">
            Add, edit and manage food items
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
