import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUserShield, FaLock, FaEnvelope } from 'react-icons/fa';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        // Check if user is admin using the returned user data
        if (result.user?.role === 'admin') {
          navigate('/admin');
        } else {
          setError('Access denied. Admin privileges required.');
          setLoading(false);
        }
      } else {
        setError(result.error || 'Invalid credentials');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <FaUserShield />
          </div>
          <h1>Admin Panel</h1>
          <p>Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <div className="admin-login-input-group">
            <FaEnvelope className="admin-login-input-icon" />
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="admin-login-input"
            />
          </div>

          <div className="admin-login-input-group">
            <FaLock className="admin-login-input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="admin-login-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-login-btn"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/" className="admin-login-back-link">
            ← Back to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
