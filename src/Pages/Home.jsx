import { useState, useEffect } from 'react';
import { menuAPI } from '../services/api';
import MenuItem from '../Components/MenuItem';
import Loading from '../Components/Loading';
import HeroCarousel from '../Components/HeroCarousel';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (categoryId) => {
    try {
      setLoading(true);
      setSelectedCategory(categoryId);

      const response = await menuAPI.getMenuItems(categoryId);
      setMenuItems(response.data.data);
    } catch (err) {
      console.error('Error filtering menu:', err);
      setError('Failed to filter menu');
    } finally {
      setLoading(false);
    }
  };

  const showAllItems = async () => {
    try {
      setLoading(true);
      setSelectedCategory(null);

      const response = await menuAPI.getMenuItems();
      setMenuItems(response.data.data);
    } catch (err) {
      console.error('Error loading menu:', err);
      setError('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  if (loading && menuItems.length === 0) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={loadMenu} className="btn btn-primary">Try Again</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Mobile Header Section */}
      <div className="mobile-header mobile-only">
        <h1 className="food-delivery-title">Hood Eatery</h1>
      </div>

      {/* Desktop Hero - only show on desktop */}
      <div className="desktop-only">
        <HeroCarousel />
      </div>

      <section className="menu-section">
        <div className="container">
          {/* Desktop: Show "Our Menu" title */}
          <h2 className="desktop-only">Our Menu</h2>

          <div className="category-tabs">
            {/* Show "All Items" button on both mobile and desktop */}
            <button
              className={`category-tab ${selectedCategory === null ? 'active' : ''}`}
              onClick={showAllItems}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => filterByCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Mobile: Show section heading */}
          <h2 className="section-heading mobile-only">
            {selectedCategory
              ? categories.find(c => c.id === selectedCategory)?.name
              : 'Protein-rich dishes'}
          </h2>

          {loading ? (
            <Loading />
          ) : (
            <>
              {menuItems.length === 0 ? (
                <div className="no-items">
                  <p>No menu items available at the moment.</p>
                </div>
              ) : (
                <div className="menu-list">
                  {menuItems.map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
