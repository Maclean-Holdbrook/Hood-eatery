import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaInfoCircle, FaBars, FaTimes, FaShoppingBasket, FaUserCircle, FaListAlt, FaUserCog } from 'react-icons/fa';
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

          <button className="hamburger-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay mobile-only" onClick={toggleSidebar}></div>}

      {/* Mobile Sidebar */}
      <aside className={`sidebar mobile-only ${sidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-close-btn" onClick={toggleSidebar}>
          <FaTimes />
        </button>

        {user ? (
          <>
            {/* User Profile Section */}
            <div className="sidebar-profile">
              <div className="profile-avatar">
                <FaUserCircle />
              </div>
              <div className="profile-info">
                <h3>{user.fullName || user.name}</h3>
                <p>{user.phone || user.email}</p>
              </div>
            </div>

            {/* Logged In Menu */}
            <nav className="sidebar-nav">
              <Link to="/my-orders" className="sidebar-link" onClick={toggleSidebar}>
                <FaListAlt className="sidebar-icon" />
                <span>Orders</span>
              </Link>

              <Link to="/profile" className="sidebar-link" onClick={toggleSidebar}>
                <FaUserCog className="sidebar-icon" />
                <span>Account</span>
              </Link>

              <Link to="/about" className="sidebar-link" onClick={toggleSidebar}>
                <FaInfoCircle className="sidebar-icon" />
                <span>About Us</span>
              </Link>

              <button onClick={() => { logout(); toggleSidebar(); }} className="sidebar-link logout-link">
                <FaSignOutAlt className="sidebar-icon" />
                <span>Logout</span>
              </button>
            </nav>
          </>
        ) : (
          <>
            {/* Logged Out Menu */}
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
              <Link to="/login" className="sidebar-link" onClick={toggleSidebar}>
                <FaUser className="sidebar-icon" />
                <span>Sign In</span>
              </Link>

              <Link to="/register" className="sidebar-link" onClick={toggleSidebar}>
                <FaUser className="sidebar-icon" />
                <span>Sign Up</span>
              </Link>

              <Link to="/about" className="sidebar-link" onClick={toggleSidebar}>
                <FaInfoCircle className="sidebar-icon" />
                <span>About Us</span>
              </Link>
            </nav>
          </>
        )}
      </aside>
    </>
  );
};

export default Header;
