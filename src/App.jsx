import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingBasket from './components/FloatingBasket';
import AdminLayout from './components/AdminLayout';
import PrivateRoute from './components/PrivateRoute';

// Customer Pages
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenu from './pages/admin/AdminMenu';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <CartProvider>
        {isAdminRoute ? (
          // Admin Layout
          <Routes>
            {/* Admin Login - No protection needed */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute adminOnly>
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/menu"
              element={
                <PrivateRoute adminOnly>
                  <AdminLayout>
                    <AdminMenu />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <PrivateRoute adminOnly>
                  <AdminLayout>
                    <AdminOrders />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        ) : (
          // Customer Layout
          <div className="app">
            <Header />
            <FloatingBasket />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Menu />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/track-order/:orderNumber" element={<TrackOrder />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Customer Routes */}
                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-orders"
                  element={
                    <PrivateRoute>
                      <MyOrders />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        )}
      </CartProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
