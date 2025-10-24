import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import socketService from '../services/socket';
import Loading from '../Components/Loading';
import { FaCheckCircle, FaClock, FaTruck, FaUtensils } from 'react-icons/fa';

const TrackOrder = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();

    // Connect to socket and join order tracking
    socketService.connect();
    socketService.trackOrder(orderNumber);

    // Listen for order updates
    socketService.onOrderUpdate((data) => {
      if (data.order) {
        setOrder(data.order);
      }
    });

    socketService.onOrderStatusUpdate((data) => {
      if (data.order && data.order.order_number === orderNumber) {
        setOrder(data.order);
      }
    });

    return () => {
      socketService.leaveOrder(orderNumber);
    };
  }, [orderNumber]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.trackOrder(orderNumber);
      setOrder(response.data.data);
    } catch (err) {
      console.error('Error loading order:', err);
      setError('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { icon: FaClock, text: 'Order Pending', color: '#FFA500' },
      confirmed: { icon: FaCheckCircle, text: 'Order Confirmed', color: '#4CAF50' },
      preparing: { icon: FaUtensils, text: 'Preparing Food', color: '#2196F3' },
      out_for_delivery: { icon: FaTruck, text: 'Out for Delivery', color: '#FF9800' },
      delivered: { icon: FaCheckCircle, text: 'Delivered', color: '#4CAF50' },
      cancelled: { icon: FaCheckCircle, text: 'Cancelled', color: '#F44336' }
    };
    return statusMap[status] || statusMap.pending;
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !order) {
    return (
      <div className="error-container">
        <h2>{error || 'Order not found'}</h2>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="track-order-page">
      <div className="container">
        <h1>Track Your Order</h1>
        <div className="order-header">
          <p>Order Number: <strong>{order.order_number}</strong></p>
          <p>Order Date: {new Date(order.created_at).toLocaleString()}</p>
        </div>

        <div className="order-status-card">
          <div className="status-icon" style={{ color: statusInfo.color }}>
            <StatusIcon />
          </div>
          <h2>{statusInfo.text}</h2>
          <div className="status-timeline">
            <div className={`status-step ${order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing' || order.status === 'out_for_delivery' || order.status === 'delivered' ? 'active' : ''}`}>
              <div className="step-icon"><FaCheckCircle /></div>
              <p>Confirmed</p>
            </div>
            <div className={`status-step ${order.status === 'preparing' || order.status === 'out_for_delivery' || order.status === 'delivered' ? 'active' : ''}`}>
              <div className="step-icon"><FaUtensils /></div>
              <p>Preparing</p>
            </div>
            <div className={`status-step ${order.status === 'out_for_delivery' || order.status === 'delivered' ? 'active' : ''}`}>
              <div className="step-icon"><FaTruck /></div>
              <p>On the way</p>
            </div>
            <div className={`status-step ${order.status === 'delivered' ? 'active' : ''}`}>
              <div className="step-icon"><FaCheckCircle /></div>
              <p>Delivered</p>
            </div>
          </div>
        </div>

        <div className="order-details-grid">
          <div className="order-card">
            <h3>Delivery Information</h3>
            <p><strong>Name:</strong> {order.customer_name}</p>
            <p><strong>Phone:</strong> {order.customer_phone}</p>
            <p><strong>Address:</strong> {order.delivery_address}</p>
          </div>

          <div className="order-card">
            <h3>Order Items</h3>
            {order.order_items.map((item) => (
              <div key={item.id} className="order-item">
                <span>{item.menu_item_name} x {item.quantity}</span>
                <span>${parseFloat(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
            <div className="order-total">
              <strong>Total: ${parseFloat(order.total).toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
