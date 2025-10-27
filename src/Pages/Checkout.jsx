import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import PaystackPop from '@paystack/inline-js';
import { FaArrowLeft, FaTrash, FaMinus, FaPlus, FaUser, FaCreditCard } from 'react-icons/fa';

const defaultCenter = {
  lat: 5.6037,  // Accra, Ghana
  lng: -0.1870
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  // Memoize libraries to prevent re-renders
  const libraries = useMemo(() => ['places'], []);
  const autocompleteRef = useRef(null);

  // Load Google Maps with Places library
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [selectedTip, setSelectedTip] = useState(0);

  const [formData, setFormData] = useState({
    customerName: user?.fullName || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    deliveryAddress: '',
    paymentMethod: 'card',
    notes: ''
  });

  const [position, setPosition] = useState(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setPosition(userLocation);
        },
        (err) => {
          console.error('Error getting location:', err);
          setPosition(defaultCenter);
        }
      );
    } else {
      setPosition(defaultCenter);
    }
  }, []);

  // Handle autocomplete load
  const onAutocompleteLoad = (autocompleteInstance) => {
    autocompleteRef.current = autocompleteInstance;
  };

  // Handle place selection
  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setPosition(location);
        setFormData(prev => ({
          ...prev,
          deliveryAddress: place.formatted_address || ''
        }));
      }
    }
  };

  // Reset tip when switching to pickup mode
  useEffect(() => {
    if (deliveryType === 'pickup') {
      setSelectedTip(0);
    }
  }, [deliveryType]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const createOrderData = () => ({
    customerName: formData.customerName,
    customerEmail: formData.customerEmail,
    customerPhone: formData.customerPhone,
    deliveryAddress: formData.deliveryAddress,
    deliveryLat: position?.lat || 0,
    deliveryLng: position?.lng || 0,
    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    paymentMethod: formData.paymentMethod,
    notes: formData.notes
  });

  const processOrder = async (orderData, paymentReference = null) => {
    try {
      const finalOrderData = paymentReference
        ? { ...orderData, paymentReference }
        : orderData;

      const response = await ordersAPI.createOrder(finalOrderData);
      const order = response.data.data;

      clearCart();

      // Redirect to My Orders page if user is logged in, otherwise to track order page
      if (user) {
        navigate('/my-orders', { state: { fromCheckout: true } });
      } else {
        navigate(`/track-order/${order.order_number}`);
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.message || 'Failed to create order');
      throw err;
    }
  };

  const handlePaystackPayment = (orderData) => {
    const paystack = new PaystackPop();
    const tipForPayment = deliveryType === 'delivery' ? selectedTip : 0;
    const subtotalAmount = getCartTotal();
    const deliveryFeeAmount = deliveryType === 'delivery' ? 0 : 0;
    const totalInKobo = Math.round((subtotalAmount + deliveryFeeAmount + tipForPayment) * 100);

    paystack.newTransaction({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: formData.customerEmail || 'customer@hoodeatery.com',
      amount: totalInKobo,
      currency: 'GHS',
      channels: ['card', 'mobile_money'],
      metadata: {
        custom_fields: [
          {
            display_name: 'Customer Name',
            variable_name: 'customer_name',
            value: formData.customerName
          },
          {
            display_name: 'Phone Number',
            variable_name: 'phone',
            value: formData.customerPhone
          }
        ]
      },
      onSuccess: async (transaction) => {
        console.log('Payment successful:', transaction);
        setLoading(true);
        try {
          await processOrder(orderData, transaction.reference);
        } catch (err) {
          setError('Payment successful but order creation failed. Please contact support.');
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => {
        console.log('Payment cancelled');
        setError('Payment was cancelled');
        setLoading(false);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError('Your basket is empty');
      return;
    }

    if (deliveryType === 'delivery' && (!position || (position.lat === 0 && position.lng === 0))) {
      setError('Please select a delivery location on the map');
      return;
    }

    if (!formData.customerEmail && (formData.paymentMethod === 'card' || formData.paymentMethod === 'mobile_money')) {
      setError('Email is required for online payments');
      return;
    }

    const orderData = createOrderData();

    if (formData.paymentMethod === 'card' || formData.paymentMethod === 'mobile_money') {
      setLoading(true);
      handlePaystackPayment(orderData);
    } else {
      try {
        setLoading(true);
        setError(null);
        await processOrder(orderData);
      } catch (err) {
        // Error already handled in processOrder
      } finally {
        setLoading(false);
      }
    }
  };

  const subtotal = getCartTotal();
  const deliveryFee = deliveryType === 'delivery' ? 0 : 0;
  const discount = 0;
  const tipAmount = deliveryType === 'delivery' ? selectedTip : 0;
  const total = subtotal + deliveryFee + tipAmount - discount;

  const tipOptions = [0, 1, 2, 5, 10];

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="container">
          <h2>Your basket is empty</h2>
          <button onClick={() => navigate('/menu')} className="btn btn-primary">
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <button className="clear-basket-btn" onClick={clearCart}>
          <FaTrash /> Clear basket
        </button>
      </div>

      <div className="checkout-container">
        {/* Cart Items Section */}
        <section className="cart-items-section">
          {cart.map((item) => (
            <div key={item.id} className="cart-item-card">
              <img
                src={item.image_url?.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <div className="cart-item-controls">
                  <button
                    className="quantity-btn delete-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FaTrash />
                  </button>
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <div className="cart-item-price-below">
                  {item.original_price && parseFloat(item.original_price) > parseFloat(item.price) && (
                    <span className="original-price-below">GHC{(item.original_price * item.quantity).toFixed(0)}</span>
                  )}
                  <span className="current-price-below">GHC{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}

          <button className="add-more-btn" onClick={() => navigate('/menu')}>
            <span className="plus-icon">+</span> Add more
          </button>

          <div className="notes-section">
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Leave a note or comment"
              className="notes-input"
            />
          </div>
        </section>

        {/* Delivery Type Toggle */}
        <section className="delivery-toggle-section">
          <div className="delivery-toggle">
            <button
              className={`toggle-btn ${deliveryType === 'delivery' ? 'active' : ''}`}
              onClick={() => setDeliveryType('delivery')}
            >
              Delivery
            </button>
            <button
              className={`toggle-btn ${deliveryType === 'pickup' ? 'active' : ''}`}
              onClick={() => setDeliveryType('pickup')}
            >
              Pickup
            </button>
          </div>
          {deliveryType === 'delivery' && (
            <p className="delivery-schedule">Schedule delivery</p>
          )}
        </section>

        {/* Contact Info Section */}
        <section className="contact-info-section">
          <button
            className="contact-info-header"
            onClick={() => setShowContactInfo(!showContactInfo)}
          >
            <div className="contact-info-title">
              <FaUser className="user-icon" />
              <span>Add contact info and address</span>
              <span className="required">*</span>
            </div>
            <FaPlus className={`plus-toggle-icon ${showContactInfo ? 'rotated' : ''}`} />
          </button>

          {showContactInfo && (
            <div className="contact-info-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  required
                />
              </div>

              {deliveryType === 'delivery' && (
                <div className="form-group">
                  <label>Delivery Address *</label>
                  <div className="address-autocomplete-container">
                    {loadError && (
                      <div className="map-error">
                        <p>Error loading Google Maps</p>
                        <p className="help-text">Please check your Google Maps API key</p>
                      </div>
                    )}
                    {!isLoaded && !loadError && (
                      <div className="map-loading">
                        <p>Loading address search...</p>
                      </div>
                    )}
                    {isLoaded && !loadError && (
                      <Autocomplete
                        onLoad={onAutocompleteLoad}
                        onPlaceChanged={onPlaceChanged}
                        options={{
                          componentRestrictions: { country: 'gh' },
                          fields: ['formatted_address', 'geometry', 'name'],
                          types: ['address']
                        }}
                      >
                        <div className="autocomplete-input-wrapper">
                          <input
                            type="text"
                            placeholder="Enter your delivery address"
                            className="autocomplete-input"
                          />
                        </div>
                      </Autocomplete>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Tip Section - Only show for delivery */}
        {deliveryType === 'delivery' && (
          <section className="tip-section">
            <div className="tip-header">
              <span className="tip-icon">🤝</span>
              <div>
                <h3>Tip the courier?</h3>
                <p>Our couriers appreciate your generosity. They get 100% of your tips.</p>
              </div>
            </div>
            <div className="tip-options">
              {tipOptions.map((tip) => (
                <button
                  key={tip}
                  className={`tip-btn ${selectedTip === tip ? 'active' : ''}`}
                  onClick={() => setSelectedTip(tip)}
                >
                  GHC{tip}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Order Summary */}
        <section className="order-summary-section">
          {discount > 0 && (
            <div className="summary-row">
              <span>50% discount</span>
              <span>-GHC{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row subtotal">
            <span>Subtotal</span>
            <span>GHC{subtotal.toFixed(2)}</span>
          </div>
          {deliveryType === 'delivery' && (
            <>
              <div className="summary-row">
                <span>Rider tip</span>
                <span>GHC{selectedTip}</span>
              </div>
              <div className="summary-row">
                <span>Delivery fee</span>
                <span>GHC{deliveryFee}</span>
              </div>
            </>
          )}
          <div className="summary-row total">
            <span>Total</span>
            <span>GHC{total.toFixed(2)}</span>
          </div>
        </section>

        {/* Payment Method */}
        <section className="payment-section">
          <label>Pay with</label>
          <div className="payment-select-wrapper">
            <FaCreditCard className="payment-icon" />
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="payment-select"
            >
              <option value="card">Card/Mobile money</option>
              <option value="cash">Cash on Delivery</option>
            </select>
          </div>
        </section>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Place Order Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="place-order-btn"
        >
          {loading ? 'Placing Order...' : `Place Order GHC${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
