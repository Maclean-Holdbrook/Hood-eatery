import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  // Get image URL - handles both Supabase Storage URLs and local filesystem paths
  const getImageUrl = () => {
    if (!item.image_url) return null;
    if (item.image_url.startsWith('http')) {
      return item.image_url;
    }
    return `${API_URL}${item.image_url}`;
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        {item.image_url ? (
          <img src={getImageUrl()} alt={item.name} />
        ) : (
          <div className="no-image-small">No Image</div>
        )}
      </div>

      <div className="cart-item-details">
        <h4>{item.name}</h4>
        <p className="cart-item-price">${parseFloat(item.price).toFixed(2)}</p>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-controls">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="btn-icon"
          >
            <FaMinus />
          </button>
          <span className="quantity">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="btn-icon"
          >
            <FaPlus />
          </button>
        </div>

        <p className="cart-item-total">
          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
        </p>

        <button
          onClick={() => removeFromCart(item.id)}
          className="btn-icon btn-remove"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
