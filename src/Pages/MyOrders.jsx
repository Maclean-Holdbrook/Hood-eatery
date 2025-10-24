import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import socketService from '../services/socket';
import Loading from '../Components/Loading';
import { FaEye, FaCheckCircle } from 'react-icons/fa';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    loadOrders();

    // Show success message if coming from checkout
    if (location.state?.fromCheckout) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }

    // Connect to socket for real-time updates
    socketService.connect();

    // Listen for order status updates
    socketService.onOrderStatusUpdate((data) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === data.orderId ? { ...order, status: data.status } : order
        )
      );
    });

    return () => {
      socketService.disconnect();
    };
  }, [location]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data.data);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'badge-warning',
      confirmed: 'badge-info',
      preparing: 'badge-info',
      out_for_delivery: 'badge-primary',
      delivered: 'badge-success',
      cancelled: 'badge-danger'
    };
    return statusMap[status] || 'badge-secondary';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      pending: 'PENDING',
      confirmed: 'CONFIRMED',
      preparing: 'PREPARING',
      out_for_delivery: 'OUT FOR DELIVERY',
      delivered: 'DELIVERED',
      cancelled: 'CANCELLED'
    };
    return labelMap[status] || status.toUpperCase();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={loadOrders} className="btn btn-primary">Try Again</button>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="container">
        <h1>My Orders</h1>

        {showSuccess && (
          <div className="success-banner">
            <FaCheckCircle /> Your order has been placed successfully! Track your order status below.
          </div>
        )}

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <h3>Order #{order.order_number}</h3>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="order-card-body">
                  <div className="order-items-summary">
                    <h4>Items:</h4>
                    {order.order_items.map((item) => (
                      <p key={item.id}>
                        {item.menu_item_name} x {item.quantity} - ${parseFloat(item.subtotal).toFixed(2)}
                      </p>
                    ))}
                  </div>

                  <div className="order-total">
                    <strong>Total: ${parseFloat(order.total).toFixed(2)}</strong>
                  </div>
                </div>

                <div className="order-card-footer">
                  <Link to={`/track-order/${order.order_number}`} className="btn btn-primary">
                    <FaEye /> Track Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
