import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, logout, isAdmin, loading } = useAuth();
  const { getCartCount } = useCart();

  // Don't show header while loading or for admin users
  if (loading || isAdmin()) {
    return null;
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>Hood Eatery</h1>
          </Link>

          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/menu" className="nav-link">Menu</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            {user && (
              <Link to="/my-orders" className="nav-link">My Orders</Link>
            )}
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="cart-icon">
              <FaShoppingCart />
              {getCartCount() > 0 && (
                <span className="cart-badge">{getCartCount()}</span>
              )}
            </Link>

            {user ? (
              <div className="user-menu">
                <span className="user-name">
                  <FaUser /> {user.fullName}
                </span>
                <button onClick={logout} className="btn-logout">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
