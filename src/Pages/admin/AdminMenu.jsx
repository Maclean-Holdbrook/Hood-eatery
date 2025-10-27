import { useState, useEffect } from 'react';
import { menuAPI } from '../../services/api';
import Loading from '../../Components/Loading';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { useAlert } from '../../context/AlertContext';

const AdminMenu = () => {
  const alert = useAlert();
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
    image: null,
    extras: [],
    portions: []
  });

  const [newExtra, setNewExtra] = useState({ name: '', price: '', originalPrice: '' });
  const [newPortion, setNewPortion] = useState({ name: '', price: '', originalPrice: '' });

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

    // Add extras and portions as JSON strings
    data.append('extras', JSON.stringify(formData.extras));
    data.append('portions', JSON.stringify(formData.portions));

    if (formData.image) {
      data.append('image', formData.image);
    }
    try {
      if (editingItem) {
        await menuAPI.updateMenuItem(editingItem.id, data);
        alert.success('Menu item updated successfully!');
      } else {
        await menuAPI.createMenuItem(data);
        alert.success('Menu item added successfully!');
      }

      setShowModal(false);
      setEditingItem(null);
      resetForm();
      loadMenu();
    } catch (err) {
      console.error('Error saving menu item:', err);
      alert.error(err.response?.data?.message || 'Failed to save menu item. Please try again.');
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
      image: null,
      extras: item.extras || [],
      portions: item.portions || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await alert.confirm(
      'Are you sure you want to delete this menu item? This action cannot be undone.',
      'Delete Menu Item',
      {
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel'
      }
    );

    if (!confirmed) {
      return;
    }

    try {
      await menuAPI.deleteMenuItem(id);
      alert.success('Menu item deleted successfully!');
      loadMenu();
    } catch (err) {
      console.error('Error deleting menu item:', err);
      alert.error(err.response?.data?.message || 'Failed to delete menu item. Please try again.');
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
      image: null,
      extras: [],
      portions: []
    });
    setNewExtra({ name: '', price: '', originalPrice: '' });
    setNewPortion({ name: '', price: '', originalPrice: '' });
  };

  const addExtra = () => {
    if (newExtra.name && newExtra.price) {
      const extra = {
        id: Date.now(),
        name: newExtra.name,
        price: parseFloat(newExtra.price),
        originalPrice: newExtra.originalPrice ? parseFloat(newExtra.originalPrice) : null
      };
      setFormData({ ...formData, extras: [...formData.extras, extra] });
      setNewExtra({ name: '', price: '', originalPrice: '' });
    }
  };

  const removeExtra = (id) => {
    setFormData({
      ...formData,
      extras: formData.extras.filter(extra => extra.id !== id)
    });
  };

  const addPortion = () => {
    if (newPortion.name && newPortion.price !== '') {
      const portion = {
        id: newPortion.name.toLowerCase().replace(/\s+/g, '_'),
        name: newPortion.name,
        price: parseFloat(newPortion.price),
        originalPrice: newPortion.originalPrice ? parseFloat(newPortion.originalPrice) : null
      };
      setFormData({ ...formData, portions: [...formData.portions, portion] });
      setNewPortion({ name: '', price: '', originalPrice: '' });
    }
  };

  const removePortion = (id) => {
    setFormData({
      ...formData,
      portions: formData.portions.filter(portion => portion.id !== id)
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

                {/* Extras Section */}
                <div className="form-group">
                  <label>Extras/Add-ons</label>
                  <div className="extras-manager">
                    <div className="extras-input-row">
                      <input
                        type="text"
                        placeholder="Extra name (e.g., egg, chicken)"
                        value={newExtra.name}
                        onChange={(e) => setNewExtra({ ...newExtra, name: e.target.value })}
                        style={{ flex: 2 }}
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={newExtra.price}
                        onChange={(e) => setNewExtra({ ...newExtra, price: e.target.value })}
                        style={{ flex: 1 }}
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Original (optional)"
                        value={newExtra.originalPrice}
                        onChange={(e) => setNewExtra({ ...newExtra, originalPrice: e.target.value })}
                        style={{ flex: 1 }}
                      />
                      <button type="button" onClick={addExtra} className="btn btn-sm btn-primary">
                        Add
                      </button>
                    </div>
                    <div className="extras-list">
                      {formData.extras.map((extra) => (
                        <div key={extra.id} className="extra-tag">
                          <span>{extra.name} - GHC{extra.price.toFixed(2)}</span>
                          <button type="button" onClick={() => removeExtra(extra.id)} className="remove-tag-btn">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="help-text">Add extra items customers can add to their order</p>
                </div>

                {/* Portions Section */}
                <div className="form-group">
                  <label>Portion Sizes</label>
                  <div className="portions-manager">
                    <div className="portions-input-row">
                      <input
                        type="text"
                        placeholder="Portion name (e.g., Individual, Family)"
                        value={newPortion.name}
                        onChange={(e) => setNewPortion({ ...newPortion, name: e.target.value })}
                        style={{ flex: 2 }}
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Additional price (0 for base)"
                        value={newPortion.price}
                        onChange={(e) => setNewPortion({ ...newPortion, price: e.target.value })}
                        style={{ flex: 1 }}
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Original (optional)"
                        value={newPortion.originalPrice}
                        onChange={(e) => setNewPortion({ ...newPortion, originalPrice: e.target.value })}
                        style={{ flex: 1 }}
                      />
                      <button type="button" onClick={addPortion} className="btn btn-sm btn-primary">
                        Add
                      </button>
                    </div>
                    <div className="portions-list">
                      {formData.portions.map((portion) => (
                        <div key={portion.id} className="portion-tag">
                          <span>{portion.name} - +GHC{portion.price.toFixed(2)}</span>
                          <button type="button" onClick={() => removePortion(portion.id)} className="remove-tag-btn">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="help-text">Add different portion sizes (e.g., Individual, Family)</p>
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
