import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../Components/CartItem';
import { FaShoppingBasket } from 'react-icons/fa';

const Cart = () => {
  const { cart, getCartTotal, getCartCount, clearCart } = useCart();

  const deliveryFee = 5.00;
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="container">
          <FaShoppingBasket className="empty-cart-icon" />
          <h2>Your basket is empty</h2>
          <p>Add some delicious items from our menu!</p>
          <Link to="/menu" className="btn btn-primary">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Your Basket ({getCartCount()} items)</h1>
          <button onClick={clearCart} className="btn btn-outline">
            Clear Basket
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary btn-block">
              Proceed to Checkout
            </Link>
            <Link to="/menu" className="btn btn-outline btn-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
