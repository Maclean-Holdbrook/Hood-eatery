import { FaUtensils, FaHeart, FaLeaf, FaClock } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1>About Hood Eatery</h1>
          <p className="subtitle">Where passion meets flavor</p>
        </div>
      </div>

      <div className="container">
        <section className="about-section">
          <div className="about-content">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                Founded in 2020, Hood Eatery began with a simple mission: to bring
                delicious, high-quality food straight to your doorstep. What started
                as a small neighborhood eatery has grown into a beloved local
                restaurant, serving hundreds of happy customers every day.
              </p>
              <p>
                We believe that great food brings people together. Every dish we
                prepare is made with love, using only the freshest ingredients
                sourced from local suppliers. Our team of passionate chefs crafts
                each meal with care, ensuring that every bite is a delightful
                experience.
              </p>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <FaUtensils size={80} />
              </div>
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <FaHeart size={40} />
              </div>
              <h3>Made with Love</h3>
              <p>
                Every dish is prepared with passion and attention to detail,
                ensuring the highest quality in every bite.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaLeaf size={40} />
              </div>
              <h3>Fresh Ingredients</h3>
              <p>
                We source only the freshest, locally-grown ingredients to create
                our delicious menu items.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaClock size={40} />
              </div>
              <h3>Fast Delivery</h3>
              <p>
                Your food arrives hot and fresh, delivered quickly and efficiently
                right to your door.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaUtensils size={40} />
              </div>
              <h3>Authentic Flavors</h3>
              <p>
                Experience authentic recipes passed down through generations,
                bringing you true comfort food.
              </p>
            </div>
          </div>
        </section>

        <section className="mission-section">
          <h2>Our Mission</h2>
          <div className="mission-content">
            <p>
              At Hood Eatery, our mission is to create memorable dining experiences
              by serving exceptional food that nourishes both body and soul. We're
              committed to:
            </p>
            <ul>
              <li>Providing delicious, high-quality meals at affordable prices</li>
              <li>Supporting local farmers and suppliers</li>
              <li>Reducing our environmental impact through sustainable practices</li>
              <li>Building a strong community through food</li>
              <li>Delivering exceptional customer service with every order</li>
            </ul>
          </div>
        </section>

        <section className="team-section">
          <h2>Meet Our Team</h2>
          <p className="team-intro">
            Behind every great meal is a great team. Our passionate chefs, friendly
            delivery drivers, and dedicated staff work together to bring you the
            best dining experience possible.
          </p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">
                <div className="photo-placeholder">JD</div>
              </div>
              <h3>John Doe</h3>
              <p className="member-role">Head Chef</p>
              <p>20+ years of culinary experience</p>
            </div>

            <div className="team-member">
              <div className="member-photo">
                <div className="photo-placeholder">JS</div>
              </div>
              <h3>Jane Smith</h3>
              <p className="member-role">Operations Manager</p>
              <p>Ensuring quality in every order</p>
            </div>

            <div className="team-member">
              <div className="member-photo">
                <div className="photo-placeholder">MB</div>
              </div>
              <h3>Mike Brown</h3>
              <p className="member-role">Sous Chef</p>
              <p>Creativity meets tradition</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
