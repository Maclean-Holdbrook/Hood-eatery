import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { isAdmin } = useAuth();

  // Don't show footer for admin users
  if (isAdmin()) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Hood Eatery</h3>
            <p>Delicious food delivered to your doorstep. Fresh, fast, and flavorful!</p>
            <div className="social-links">
              <a href="#" className="social-icon"><FaFacebook /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
              <a href="#" className="social-icon"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul className="contact-info">
              <li><FaPhone /> +1 (555) 123-4567</li>
              <li><FaEnvelope /> info@hoodeatery.com</li>
              <li><FaMapMarkerAlt /> 123 Food Street, City</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Opening Hours</h4>
            <ul>
              <li>Monday - Friday: 9:00 AM - 10:00 PM</li>
              <li>Saturday - Sunday: 10:00 AM - 11:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Hood Eatery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
