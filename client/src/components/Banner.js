// import React, { Component } from 'react';
// import '../css/banner.css';

// class Banner extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       images: ["/path/to/image1.jpg", "/path/to/image2.jpg", "/path/to/image3.jpg"], // Add your image paths here
//       currentImageIndex: 0
//     };
//   }

//   componentDidMount() {
//     this.interval = setInterval(this.changeImage, 5000); // Change image every 5 seconds (adjust as needed)
//   }

//   componentWillUnmount() {
//     clearInterval(this.interval);
//   }

//   changeImage = () => {
//     const { images, currentImageIndex } = this.state;
//     const nextIndex = (currentImageIndex + 1) % images.length;
//     this.setState({ currentImageIndex: nextIndex });
//   };

//   render() {
//     const { images, currentImageIndex } = this.state;
//     const bannerStyle = {
//       backgroundImage: `linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%), url(${images[currentImageIndex]})`
//     };

//     return (
//       <div className="banner" style={bannerStyle}>
//         {/* You can add any content or overlay text here */}
//       </div>
//     );
//   }
// }

// export default Banner;


import React, { Component } from 'react';
import '../css/banner.css';

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: ['#e3ffe7', '#d9e7ff', '#ffc0cb'], // Add your gradient colors here
      currentColorIndex: 0
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.changeColor, 5000); // Change color every 5 seconds (adjust as needed)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  changeColor = () => {
    const { colors, currentColorIndex } = this.state;
    const nextIndex = (currentColorIndex + 1) % colors.length;
    this.setState({ currentColorIndex: nextIndex });
  };

  handleDotClick = (index) => {
    this.setState({ currentColorIndex: index });
  };

  render() {
    const { colors, currentColorIndex } = this.state;
    const bannerStyle = {
      backgroundImage: `linear-gradient(90deg, ${colors[currentColorIndex]} 0%, ${colors[(currentColorIndex + 1) % colors.length]} 100%)`
    };

    return (
      <div className="banner" style={bannerStyle}>
        <div className="dots">
          {colors.map((color, index) => (
            <div
              key={index}
              className={`dot ${index === currentColorIndex ? 'active' : ''}`}
              onClick={() => this.handleDotClick(index)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Banner;
