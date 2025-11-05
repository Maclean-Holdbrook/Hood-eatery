import { useState, useEffect } from 'react';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Delicious Desserts',
      description: 'Sweet treats to satisfy your cravings',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&h=600&fit=crop',
      category: 'Desserts'
    },
    {
      id: 2,
      title: 'Refreshing Drinks',
      description: 'Cool beverages for every occasion',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=1200&h=600&fit=crop',
      category: 'Drinks'
    },
    {
      id: 3,
      title: 'Tasty Main Courses',
      description: 'Hearty meals delivered fresh to your door',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=600&fit=crop',
      category: 'Main Dishes'
    },
    {
      id: 4,
      title: 'Fresh Appetizers',
      description: 'Perfect starters for your meal',
      image: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=1200&h=600&fit=crop',
      category: 'Appetizers'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <div className="hero-carousel">
      <div className="carousel-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="carousel-overlay"></div>
            <div className="carousel-content">
              <span className="carousel-category">{slide.category}</span>
              <h1 className="carousel-title">{slide.title}</h1>
              <p className="carousel-description">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>


      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
