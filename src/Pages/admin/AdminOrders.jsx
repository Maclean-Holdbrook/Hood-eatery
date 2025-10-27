import { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import socketService from '../../services/socket';
import Loading from '../../Components/Loading';
import { useAlert } from '../../context/AlertContext';

const AdminOrders = () => {
  const alert = useAlert();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    loadOrders();

    // Connect to socket and join admin room
    socketService.connect();
    socketService.joinAdmin();

    // Listen for new orders and updates
    socketService.onNewOrder((order) => {
      console.log('New order received:', order);
      setOrders((prev) => [order, ...prev]);
    });

    socketService.onOrderStatusUpdate((data) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === data.orderId ? { ...order, status: data.status } : order
        )
      );
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadOrders = async (status = '') => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrders(status);
      setOrders(response.data.data);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    loadOrders(status);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setStatusUpdate(order.status);
    setStatusNote('');
    setShowModal(true);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await ordersAPI.updateOrderStatus(selectedOrder.id, statusUpdate);
      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id ? { ...order, status: statusUpdate } : order
        )
      );
      setSelectedOrder({ ...selectedOrder, status: statusUpdate });
      setStatusNote('');
      alert.success('Order status updated successfully!', 'Status Updated');
    } catch (err) {
      console.error('Error updating order status:', err);
      alert.error(err.response?.data?.message || 'Failed to update order status. Please try again.', 'Update Failed');
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

  if (loading && orders.length === 0) {
    return <Loading />;
  }

  return (
    <div className="admin-orders-page">
      <div className="container">
        <h1>Orders Management</h1>

        <div className="orders-filter">
          <button
            className={`filter-btn ${filterStatus === '' ? 'active' : ''}`}
            onClick={() => handleFilterChange('')}
          >
            All Orders
          </button>
          <button
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => handleFilterChange('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filterStatus === 'confirmed' ? 'active' : ''}`}
            onClick={() => handleFilterChange('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`filter-btn ${filterStatus === 'preparing' ? 'active' : ''}`}
            onClick={() => handleFilterChange('preparing')}
          >
            Preparing
          </button>
          <button
            className={`filter-btn ${filterStatus === 'out_for_delivery' ? 'active' : ''}`}
            onClick={() => handleFilterChange('out_for_delivery')}
          >
            Out for Delivery
          </button>
          <button
            className={`filter-btn ${filterStatus === 'delivered' ? 'active' : ''}`}
            onClick={() => handleFilterChange('delivered')}
          >
            Delivered
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found</p>
          </div>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.order_number}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.customer_phone}</td>
                    <td>{order.delivery_address.substring(0, 30)}...</td>
                    <td>${parseFloat(order.total).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="btn btn-sm btn-primary"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && selectedOrder && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order Details - {selectedOrder.order_number}</h2>
                <button onClick={() => setShowModal(false)} className="btn-close">&times;</button>
              </div>

              <div className="order-details-content">
                <div className="order-info-section">
                  <h3>Customer Information</h3>
                  <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer_email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                </div>

                <div className="order-info-section">
                  <h3>Delivery Information</h3>
                  <p><strong>Address:</strong> {selectedOrder.delivery_address}</p>
                  <p><strong>Coordinates:</strong> {selectedOrder.delivery_lat}, {selectedOrder.delivery_lng}</p>
                </div>

                <div className="order-info-section">
                  <h3>Order Items</h3>
                  {selectedOrder.order_items.map((item) => (
                    <div key={item.id} className="order-item-row">
                      <span>{item.menu_item_name} x {item.quantity}</span>
                      <span>${parseFloat(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="order-totals">
                    <div className="total-row">
                      <span>Subtotal:</span>
                      <span>${parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                      <span>Delivery Fee:</span>
                      <span>${parseFloat(selectedOrder.delivery_fee).toFixed(2)}</span>
                    </div>
                    <div className="total-row total">
                      <span>Total:</span>
                      <span>${parseFloat(selectedOrder.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="order-info-section">
                  <h3>Payment Method</h3>
                  <p>{selectedOrder.payment_method.replace('_', ' ').toUpperCase()}</p>
                </div>

                {selectedOrder.notes && (
                  <div className="order-info-section">
                    <h3>Notes</h3>
                    <p>{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="order-info-section">
                  <h3>Update Order Status</h3>

                  <div className="live-tracking-banner">
                    <span className="tracking-icon">📡</span>
                    <span>Live Tracking Enabled: Customers viewing this order will receive instant updates</span>
                  </div>

                  <form onSubmit={handleStatusUpdate} className="status-update-form">
                    <div className="form-group">
                      <label htmlFor="status">Status *</label>
                      <select
                        id="status"
                        value={statusUpdate}
                        onChange={(e) => setStatusUpdate(e.target.value)}
                        className="status-select"
                        required
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="note">Comment/Note</label>
                      <textarea
                        id="note"
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        placeholder="Add a note for the customer (optional)"
                        className="status-note"
                        rows="4"
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">
                      Update Status
                    </button>
                  </form>
                </div>
              </div>

              <div className="modal-footer">
                <button onClick={() => setShowModal(false)} className="btn btn-outline">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
