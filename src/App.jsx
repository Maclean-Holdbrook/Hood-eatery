import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout Components
import Header from './Components/Header';
import Footer from './Components/Footer';
import FloatingBasket from './Components/FloatingBasket';
import AdminLayout from './Components/AdminLayout';
import PrivateRoute from './Components/PrivateRoute';

// Customer Pages
import Menu from './Pages/Menu';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import TrackOrder from './Pages/TrackOrder';
import Login from './Pages/Login';
import Register from './Pages/Register';
import MyOrders from './Pages/MyOrders';

// Admin Pages
import AdminLogin from './Pages/admin/AdminLogin';
import AdminDashboard from './Pages/admin/AdminDashboard';
import AdminMenu from './Pages/admin/AdminMenu';
import AdminOrders from './Pages/admin/AdminOrders';
import AdminUsers from './Pages/admin/AdminUsers';

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
