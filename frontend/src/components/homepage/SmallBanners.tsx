import React from 'react';
import './SmallBanners.css';

import img3 from '../../assets/trang-tri-bia-sach-6.jpg.webp';
import img4 from '../../assets/trang-tri-bia-sach.webp';

const SmallBanners: React.FC = () => {
    const smallBanners = [
        { id: 1, image: img3, title: 'Banner 3' },
        { id: 2, image: img4, title: 'Banner 4' },
    ];

    return (
        <div className="small-banners-container">
            {smallBanners.map(banner => (
                <div key={banner.id} className="small-banner-item ms-book-card">
                    <img src={banner.image} alt={banner.title} />
                </div>
            ))}
        </div>
    );
};

export default SmallBanners;
