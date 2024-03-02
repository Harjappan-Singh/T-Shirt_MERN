import React, { Component } from 'react';
import '../css/banner.css';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import angelblue from '../css/images/angelblue.png';
import angelwhite from '../css/images/angelwhite.png';

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrls: [
        require('../css/images/frontpage.jpeg'),
        require('../css/images/img2.png'),
        require('../css/images/heaven.jpeg'),
      ],
      currentImageIndex: 0,
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.changeImage, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  changeImage = () => {
    const { imageUrls, currentImageIndex } = this.state;
    const nextIndex = (currentImageIndex + 1) % imageUrls.length;
    this.setState({ currentImageIndex: nextIndex });
  };

  handleDotClick = (index) => {
    this.setState({ currentImageIndex: index });
  };

  render() {
    const { imageUrls, currentImageIndex } = this.state;
    const bannerStyle = {
      backgroundImage: `url(${imageUrls[currentImageIndex]})`,
    };


    const bannerTexts = [
      "Explore Our Member-Exclusive Heaven Collection",
      "Explore our SS24 Menswear",
      "Discover Trending Styles",
    ];
    

    return (
      
      <div className="banner-container">
      <div className="thin-banner-text">
        <p>50% OFF! Use code DEREK </p>
        <p>Free Shipping on all orders over €50</p>
        <p>Redeem Member-Exclusive Coupon: HEAVEN</p>
      </div>
      

      

      

        {/* Main banner */}
      <div className="banner" style={bannerStyle}>
        <div className="text-container">
        <h1 className="angel-blue">{bannerTexts[currentImageIndex]}</h1>
          <Link to="/Login">
          <img className="angel-blue-image" src={angelwhite} alt="Login" />
            </Link>
        </div>

        <div className="dots">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className={`dot ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => this.handleDotClick(index)}
            />
          ))}
        </div>
        </div>
        </div>
      
    );
  }
}

export default Banner;
