import { Link, useLocation } from 'react-router-dom';
import { FaShoppingBasket } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const FloatingBasket = () => {
  const { getCartCount } = useCart();
  const location = useLocation();
  const cartCount = getCartCount();

  // Don't show on admin routes or cart page
  if (location.pathname.startsWith('/admin') || location.pathname === '/cart') {
    return null;
  }

  // Only show if there are items in the basket
  if (cartCount === 0) {
    return null;
  }

  return (
    <Link to="/cart" className="floating-basket">
      <FaShoppingBasket className="basket-icon" />
      <span className="basket-count">{cartCount}</span>
      <span className="basket-text">Basket</span>
    </Link>
  );
};

export default FloatingBasket;
