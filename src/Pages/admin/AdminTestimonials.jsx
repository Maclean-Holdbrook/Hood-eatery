import { useState, useEffect } from 'react';
import Loading from '../../Components/Loading';
import { FaStar, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await testimonialsAPI.getAll();
      // setTestimonials(response.data.data);

      // Mock data for now
      setTestimonials([
        {
          id: 1,
          userName: 'Sarah Johnson',
          userEmail: 'sarah@example.com',
          rating: 5,
          comment: 'Amazing food! The jollof rice was absolutely delicious. Will definitely order again!',
          status: 'approved',
          createdAt: '2025-10-15'
        },
        {
          id: 2,
          userName: 'Michael Brown',
          userEmail: 'michael@example.com',
          rating: 4,
          comment: 'Great service and tasty meals. Delivery was on time.',
          status: 'approved',
          createdAt: '2025-10-14'
        },
        {
          id: 3,
          userName: 'Emma Wilson',
          userEmail: 'emma@example.com',
          rating: 5,
          comment: 'Best Nigerian food in town! The suya is incredible.',
          status: 'pending',
          createdAt: '2025-10-18'
        },
        {
          id: 4,
          userName: 'David Lee',
          userEmail: 'david@example.com',
          rating: 3,
          comment: 'Food was good but delivery took longer than expected.',
          status: 'approved',
          createdAt: '2025-10-12'
        }
      ]);
    } catch (err) {
      console.error('Error loading testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      // TODO: Replace with actual API call
      // await testimonialsAPI.approve(id);
      setTestimonials(testimonials.map(t =>
        t.id === id ? { ...t, status: 'approved' } : t
      ));
    } catch (err) {
      console.error('Error approving testimonial:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      // TODO: Replace with actual API call
      // await testimonialsAPI.reject(id);
      setTestimonials(testimonials.map(t =>
        t.id === id ? { ...t, status: 'rejected' } : t
      ));
    } catch (err) {
      console.error('Error rejecting testimonial:', err);
    }
  };

  const filteredTestimonials = testimonials
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t =>
      t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        style={{
          color: index < rating ? '#ffd700' : '#e0e0e0',
          fontSize: '0.9rem'
        }}
      />
    ));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1 className="admin-page-title">Testimonials Management</h1>
      <p className="admin-page-subtitle">Review and moderate customer testimonials</p>

      <div className="admin-filters">
        <div className="admin-search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>

        <div className="admin-filter-buttons">
          <button
            className={`admin-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({testimonials.length})
          </button>
          <button
            className={`admin-filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({testimonials.filter(t => t.status === 'pending').length})
          </button>
          <button
            className={`admin-filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved ({testimonials.filter(t => t.status === 'approved').length})
          </button>
          <button
            className={`admin-filter-btn ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({testimonials.filter(t => t.status === 'rejected').length})
          </button>
        </div>
      </div>

      <div className="admin-testimonials-grid">
        {filteredTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="admin-testimonial-card">
            <div className="admin-testimonial-header">
              <div>
                <h3 className="admin-testimonial-user">{testimonial.userName}</h3>
                <p className="admin-testimonial-email">{testimonial.userEmail}</p>
              </div>
              <div className="admin-testimonial-rating">
                {renderStars(testimonial.rating)}
              </div>
            </div>

            <p className="admin-testimonial-comment">{testimonial.comment}</p>

            <div className="admin-testimonial-footer">
              <span className="admin-testimonial-date">
                {new Date(testimonial.createdAt).toLocaleDateString()}
              </span>
              <span className={`admin-badge admin-badge-${testimonial.status}`}>
                {testimonial.status}
              </span>
            </div>

            {testimonial.status === 'pending' && (
              <div className="admin-testimonial-actions">
                <button
                  className="admin-btn admin-btn-approve"
                  onClick={() => handleApprove(testimonial.id)}
                >
                  <FaCheck /> Approve
                </button>
                <button
                  className="admin-btn admin-btn-reject"
                  onClick={() => handleReject(testimonial.id)}
                >
                  <FaTimes /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="admin-empty-state">
          <p>No testimonials found</p>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
