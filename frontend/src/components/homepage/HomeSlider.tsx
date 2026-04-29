import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './HomeSlider.css';

import img1 from '../../assets/1.png';
import img2 from '../../assets/2.jpg';

const HomeSlider: React.FC = () => {
    const banners = [
        { id: 1, image: img1, title: 'Banner 1' },
        { id: 2, image: img2, title: 'Banner 2' }
    ];

    return (
        <div className="home-slider-container">
            <Carousel
                showArrows={true}
                autoPlay={true}
                infiniteLoop={true}
                showThumbs={false}
                showStatus={false}
                interval={4000}
                className="main-slider"
            >
                {banners.map(banner => (
                    <div key={banner.id} className="slider-item">
                        <img src={banner.image} alt={banner.title} />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default HomeSlider;
