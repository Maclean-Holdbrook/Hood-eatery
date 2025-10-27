import { useState, useEffect } from 'react';
import { FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const FoodDetailModal = ({ item, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedPortion, setSelectedPortion] = useState(null);
  const [note, setNote] = useState('');

  // Mock extras data - in production, this would come from the backend
  const mockExtras = [
    { id: 1, name: 'egg', price: 2.50, originalPrice: 5.00 },
    { id: 2, name: 'shito', price: 5.00, originalPrice: 10.00 },
    { id: 3, name: 'chicken', price: 7.50, originalPrice: 15.00 },
    { id: 4, name: 'fish', price: 6.00, originalPrice: 12.00 },
    { id: 5, name: 'coleslaw', price: 5.00, originalPrice: 10.00 },
  ];

  const portions = [
    { id: 'individual', name: 'Individual', price: 0 },
    { id: 'family', name: 'Family', price: 25.00, originalPrice: 50.00 },
  ];

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedExtras([]);
      setSelectedPortion(null);
      setNote('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const toggleExtra = (extra) => {
    setSelectedExtras(prev => {
      const exists = prev.find(e => e.id === extra.id);
      if (exists) {
        return prev.filter(e => e.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  };

  const calculateTotal = () => {
    let total = parseFloat(item.price);

    if (selectedPortion) {
      total += selectedPortion.price;
    }

    selectedExtras.forEach(extra => {
      total += extra.price;
    });

    return total * quantity;
  };

  const handleAddToBasket = () => {
    const cartItem = {
      ...item,
      quantity,
      extras: selectedExtras,
      portion: selectedPortion,
      note,
      totalPrice: calculateTotal()
    };

    addToCart(cartItem);
    onClose();
  };

  const getImageUrl = () => {
    if (!item.image_url) return null;
    if (item.image_url.startsWith('http')) {
      return item.image_url;
    }
    return `${API_URL}${item.image_url}`;
  };

  return (
    <div className="food-detail-modal-overlay" onClick={onClose}>
      <div className="food-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="food-detail-image-container">
          {item.image_url ? (
            <img src={getImageUrl()} alt={item.name} className="food-detail-image" />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>

        <div className="food-detail-content">
          <div className="food-detail-header">
            <h2>{item.name}</h2>
            <div className="food-detail-prices">
              {item.original_price && parseFloat(item.original_price) > parseFloat(item.price) && (
                <span className="original-price-large">GHC{parseFloat(item.original_price).toFixed(0)}</span>
              )}
              <span className="current-price-large">GHC{parseFloat(item.price).toFixed(0)}</span>
            </div>
          </div>

          {item.description && (
            <p className="food-detail-description">{item.description}</p>
          )}

          {/* Portion Selection */}
          <div className="portion-section">
            <h3>Portion Size</h3>
            <div className="portion-options">
              {portions.map((portion) => (
                <label key={portion.id} className="portion-option">
                  <input
                    type="radio"
                    name="portion"
                    checked={selectedPortion?.id === portion.id}
                    onChange={() => setSelectedPortion(portion)}
                  />
                  <div className="portion-details">
                    <span className="portion-name">{portion.name}</span>
                    {portion.price > 0 && (
                      <div className="portion-price">
                        {portion.originalPrice && (
                          <span className="portion-original-price">+GHC{portion.originalPrice.toFixed(0)}</span>
                        )}
                        <span className="portion-current-price">+GHC{portion.price.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Extras Section */}
          <div className="extras-section">
            <h3>Extras</h3>
            <div className="extras-list">
              {mockExtras.map((extra) => (
                <label key={extra.id} className="extra-item">
                  <input
                    type="checkbox"
                    checked={selectedExtras.some(e => e.id === extra.id)}
                    onChange={() => toggleExtra(extra)}
                  />
                  <span className="extra-name">{extra.name}</span>
                  <div className="extra-prices">
                    {extra.originalPrice && (
                      <span className="extra-original-price">+GHC{extra.originalPrice.toFixed(0)}</span>
                    )}
                    <span className="extra-current-price">+GHC{extra.price.toFixed(2)}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Note Section */}
          <div className="note-section">
            <input
              type="text"
              placeholder="Leave a note for the kitchen"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="note-input"
            />
          </div>

          {/* Remove/Quantity/Add Section */}
          <div className="quantity-add-section">
            {quantity > 1 && (
              <button className="remove-from-basket" onClick={() => setQuantity(1)}>
                Remove {quantity - 1} from basket.
              </button>
            )}

            <div className="quantity-add-controls">
              <div className="quantity-controls-large">
                <button
                  className="quantity-btn-large"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span className="quantity-large">{quantity}</span>
                <button
                  className="quantity-btn-large"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <FaPlus />
                </button>
              </div>

              <button className="add-to-basket-btn" onClick={handleAddToBasket}>
                Add
                <span className="add-basket-price">GHC{calculateTotal().toFixed(0)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailModal;
