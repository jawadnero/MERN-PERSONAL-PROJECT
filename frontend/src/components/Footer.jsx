import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info Section */}
        <div className="footer-section">
          <h3 className="footer-heading">ShopNest</h3>
          <p className="footer-text">Your one-stop shop for all your needs. Quality products at great prices.</p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h4 className="footer-subheading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        {/* Customer Service Section */}
        <div className="footer-section">
          <h4 className="footer-subheading">Customer Service</h4>
          <ul className="footer-links">
            <li><Link to="/returns">Returns</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h4 className="footer-subheading">Contact Us</h4>
          <p className="footer-text">Email: support@shopnest.com</p>
          <p className="footer-text">Phone: 1-800-SHOP-NEST</p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>&copy; 2024 ShopNest. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer