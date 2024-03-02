import React from 'react';
import '../css/footer.css';

class Footer extends React.Component {
    render() {
        return (
            <div className="footer">
              <div className="footer-social-icons">
          <box-icon name='facebook-circle' type='logo'></box-icon>
          <box-icon name='instagram' type='logo'></box-icon>
          <box-icon name='pinterest' type='logo'></box-icon>
        </div>
        <div className="footer-section">
    <div className="footer-pages">
      <a href="/about-us">About Us</a>
      <a href="/contact-us">Contact Us</a>
      <a href="/services">Services</a>
      <a href="/products">Products</a>
      <a href="/blog">Blog</a>
      <a href="/faq">FAQ</a>
    </div>
    <div className="footer-creators">
      <h3>Harjappan</h3>
      <h3>Aoife</h3>
      <h3>Meghan</h3>
    </div>
  </div>
      </div>
        );
    }
}

export default Footer;
