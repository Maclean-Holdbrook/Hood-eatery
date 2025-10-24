import { useState, useEffect } from 'react';
import { menuAPI } from '../../services/api';
import Loading from '../../components/Loading';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const AdminMenu = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    isAvailable: true,
    isFeatured: false,
    image: null
  });

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  // Get image URL - handles both Supabase Storage URLs and local filesystem paths
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${API_URL}${imageUrl}`;
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const [categoriesRes, itemsRes] = await Promise.all([
        menuAPI.getCategories(),
        menuAPI.getMenuItems()
      ]);

      setCategories(categoriesRes.data.data);
      setMenuItems(itemsRes.data.data);
    } catch (err) {
      console.error('Error loading menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('categoryId', formData.categoryId);
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    if (formData.originalPrice) {
      data.append('originalPrice', formData.originalPrice);
    }
    data.append('isAvailable', formData.isAvailable);
    data.append('isFeatured', formData.isFeatured);
    
  
    if (formData.image) {
      data.append('image', formData.image);
    }
    try {
      if (editingItem) {
        await menuAPI.updateMenuItem(editingItem.id, data);
      } else {
        await menuAPI.createMenuItem(data);
      }

      setShowModal(false);
      setEditingItem(null);
      resetForm();
      loadMenu();
    } catch (err) {
      console.error('Error saving menu item:', err);
      alert('Failed to save menu item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      categoryId: item.category_id,
      name: item.name,
      description: item.description,
      price: item.price,
      originalPrice: item.original_price || '',
      isAvailable: item.is_available,
      isFeatured: item.is_featured,
      image: null
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await menuAPI.deleteMenuItem(id);
      loadMenu();
    } catch (err) {
      console.error('Error deleting menu item:', err);
      alert('Failed to delete menu item');
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: '',
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      isAvailable: true,
      isFeatured: false,
      image: null
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    resetForm();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-menu-page">
      <div className="container">
        <div className="page-header">
          <h1>Menu Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            <FaPlus /> Add New Item
          </button>
        </div>

        <div className="menu-items-grid">
          {menuItems.map((item) => (
            <div key={item.id} className="admin-menu-card">
              <div className="menu-card-image">
                {item.image_url ? (
                  <img src={getImageUrl(item.image_url)} alt={item.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="menu-card-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p className="price">GHC{parseFloat(item.price).toFixed(2)}</p>
                <div className="menu-card-badges">
                  {item.is_featured && <span className="badge badge-featured">Featured</span>}
                  {!item.is_available && <span className="badge badge-unavailable">Unavailable</span>}
                </div>
              </div>
              <div className="menu-card-actions">
                <button onClick={() => handleEdit(item)} className="btn btn-sm btn-edit">
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-danger">
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
                <button onClick={handleCloseModal} className="btn-close">&times;</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
    <label>Original Price (Optional)</label>
    <input
      type="number"
      step="0.01"
      name="originalPrice"
      value={formData.originalPrice}
      onChange={handleChange}
      placeholder="Leave empty if no discount"
    />
    <p className="help-text">Set original price to show discount with strikethrough</p>
  </div>

                <div className="form-group">
                  <label>Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  <p className="help-text">Upload a new image (or leave empty to keep existing)</p>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleChange}
                    />
                    Available for order
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                    />
                    Featured item
                  </label>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={handleCloseModal} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;
