import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaInfoCircle, FaBars, FaTimes, FaShoppingBasket, FaPhone } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { cart, getCartCount } = useCart();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show header on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="header desktop-header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <h1>Hood Eatery</h1>
            </Link>

            <nav className="nav">
              <Link to="/menu" className="nav-link">Menu</Link>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
              {user && user.role !== 'admin' && (
                <Link to="/my-orders" className="nav-link">My Orders</Link>
              )}
            </nav>

            <div className="header-actions">
              <Link to="/cart" className="cart-icon" title="Basket">
                <FaShoppingBasket />
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

      {/* Mobile Header */}
      <header className="mobile-header mobile-only">
        <div className="mobile-header-content">
          <Link to="/" className="mobile-logo">
            <div className="logo-icon">🍔</div>
            <div className="logo-text">
              <h2>Hood Eatery</h2>
              <p>food delivery</p>
            </div>
          </Link>

          <div className="mobile-header-actions">
            <Link to="tel:+233123456789" className="phone-btn">
              <FaPhone />
            </Link>
            {user && getCartCount() > 0 && (
              <Link to="/cart" className="cart-btn-mobile">
                <div className="cart-badge-mobile">GHC{(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}</div>
                <FaShoppingBasket />
              </Link>
            )}
            <button className="hamburger-btn" onClick={toggleSidebar}>
              <FaBars />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay mobile-only" onClick={toggleSidebar}></div>}

      {/* Mobile Sidebar */}
      <aside className={`sidebar mobile-only ${sidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-close-btn" onClick={toggleSidebar}>
          <FaTimes />
        </button>

        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">🍔</div>
            <div className="logo-text">
              <h2>Hood Eatery</h2>
              <p>food delivery</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {user ? (
            <Link to="/my-orders" className="sidebar-link" onClick={toggleSidebar}>
              <FaUser className="sidebar-icon" />
              <span>Orders</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="sidebar-link" onClick={toggleSidebar}>
                <FaUser className="sidebar-icon" />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="sidebar-link" onClick={toggleSidebar}>
                <FaUser className="sidebar-icon" />
                <span>Sign Up</span>
              </Link>
            </>
          )}

          <Link to="/about" className="sidebar-link" onClick={toggleSidebar}>
            <FaInfoCircle className="sidebar-icon" />
            <span>About Us</span>
          </Link>

          <Link to="/contact" className="sidebar-link" onClick={toggleSidebar}>
            <FaInfoCircle className="sidebar-icon" />
            <span>Contact</span>
          </Link>

          {user && getCartCount() > 0 && (
            <Link to="/cart" className="sidebar-link" onClick={toggleSidebar}>
              <FaShoppingBasket className="sidebar-icon" />
              <span>Basket ({getCartCount()})</span>
            </Link>
          )}
        </nav>

        {user && (
          <div className="sidebar-footer">
            <button onClick={() => { logout(); toggleSidebar(); }} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Header;
