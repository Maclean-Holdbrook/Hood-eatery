import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Get intended path from session storage
      const intendedPath = sessionStorage.getItem('intendedPath');
      sessionStorage.removeItem('intendedPath');

      // Check if admin and redirect accordingly using the returned user data
      if (result.user?.role === 'admin') {
        navigate(intendedPath && intendedPath.startsWith('/admin') ? intendedPath : '/admin');
      } else {
        navigate(intendedPath || '/');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);

    const result = await googleLogin(credentialResponse.credential);

    if (result.success) {
      // Get intended path from session storage
      const intendedPath = sessionStorage.getItem('intendedPath');
      sessionStorage.removeItem('intendedPath');

      if (isAdmin()) {
        navigate(intendedPath && intendedPath.startsWith('/admin') ? intendedPath : '/admin');
      } else {
        navigate(intendedPath || '/');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleGoogleError = () => {
    setError('Google sign in failed. Please try again.');
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="google-auth">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

          <p className="auth-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
