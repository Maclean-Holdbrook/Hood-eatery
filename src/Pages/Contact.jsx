import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { supportAPI } from '../services/api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
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

    try {
      setLoading(true);
      setError(null);

      await supportAPI.sendMessage(formData);
      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p className="subtitle">We'd love to hear from you!</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-content">
          <div className="contact-info-section">
            <h2>Get In Touch</h2>
            <p className="contact-intro">
              Have a question, feedback, or special request? Our team is here to help!
              Reach out to us through any of the following channels.
            </p>

            <div className="contact-cards">
              <div className="contact-card">
                <div className="contact-icon">
                  <FaPhone />
                </div>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
                <p className="contact-detail">Mon-Sun: 9:00 AM - 10:00 PM</p>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <FaEnvelope />
                </div>
                <h3>Email</h3>
                <p>info@hoodeatery.com</p>
                <p className="contact-detail">We'll respond within 24 hours</p>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <FaMapMarkerAlt />
                </div>
                <h3>Location</h3>
                <p>123 Food Street</p>
                <p className="contact-detail">Downtown, City 12345</p>
              </div>

              <div className="contact-card">
                <div className="contact-icon">
                  <FaClock />
                </div>
                <h3>Opening Hours</h3>
                <p>Mon-Fri: 9:00 AM - 10:00 PM</p>
                <p className="contact-detail">Sat-Sun: 10:00 AM - 11:00 PM</p>
              </div>
            </div>

            <div className="social-section">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <FaFacebook size={30} />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <FaTwitter size={30} />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <FaInstagram size={30} />
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send Us a Message</h2>
            {submitted && (
              <div className="success-message">
                ✓ Thank you! Your message has been sent successfully. We'll get back to you soon!
              </div>
            )}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        <div className="map-section">
          <h2>Find Us</h2>
          <div className="map-placeholder">
            <FaMapMarkerAlt size={50} />
            <p>123 Food Street, Downtown, City 12345</p>
            <p className="map-note">Interactive map coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
