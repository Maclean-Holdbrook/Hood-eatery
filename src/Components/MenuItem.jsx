import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import FoodDetailModal from './FoodDetailModal';

const MenuItem = ({ item }) => {
  const { addToCart } = useCart();
  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = () => {
    addToCart(item);
  };

  const handleItemClick = () => {
    setShowModal(true);
  };

  // Get image URL - handles both Supabase Storage URLs and local filesystem paths
  const getImageUrl = () => {
    if (!item.image_url) return null;

    // If it's already a full URL (Supabase Storage), use it directly
    if (item.image_url.startsWith('http')) {
      return item.image_url;
    }

    // Otherwise, it's a local path, prepend API URL
    return `${API_URL}${item.image_url}`;
  };

  return (
    <>
      <div className="menu-item-horizontal" onClick={handleItemClick} style={{ cursor: 'pointer' }}>
        <div className="menu-item-details">
          <h3 className="menu-item-title">{item.name}</h3>
          <p className="menu-item-description">{item.description}</p>

        {/* Mobile pricing with button */}
        <div className="menu-item-pricing mobile-only">
          {item.original_price && parseFloat(item.original_price) > parseFloat(item.price) && (
            <span className="price-original">GHC{parseFloat(item.original_price).toFixed(0)}</span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={!item.is_available}
            className="price-btn"
          >
            GHC{parseFloat(item.price).toFixed(0)}
          </button>
        </div>

        {/* Desktop pricing with add button */}
        <div className="menu-item-pricing desktop-only">
          {item.original_price && parseFloat(item.original_price) > parseFloat(item.price) && (
            <span className="price-original">GHC{parseFloat(item.original_price).toFixed(2)}</span>
          )}
          <span className="price-current">GHC{parseFloat(item.price).toFixed(2)}</span>
        </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={!item.is_available}
            className="btn btn-add-horizontal desktop-only"
          >
            <FaPlus /> Add to Basket
          </button>

          {item.is_featured && <span className="badge-featured">Featured</span>}
          {!item.is_available && <span className="badge-unavailable">Unavailable</span>}
        </div>

        <div className="menu-item-image-horizontal">
          {item.image_url ? (
            <img src={getImageUrl()} alt={item.name} />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>
      </div>

      <FoodDetailModal
        item={item}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default MenuItem;
