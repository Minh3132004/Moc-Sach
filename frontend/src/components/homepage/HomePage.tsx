import React from 'react';
import HomeSlider from './homeslider/HomeSlider';
import SmallBanners from './smallbanners/SmallBanners';
import FlashSale from './flashsale/FlashSale';
import './HomePage.css';

import img3 from '../../assets/decorations/trang-tri-bia-sach-6.jpg.webp';
import img4 from '../../assets/decorations/trang-tri-bia-sach.webp';
import img5 from '../../assets/small-banners/hbanner_img2.png';
import img6 from '../../assets/small-banners/hbanner_img1.png';
import img7 from '../../assets/small-banners/hbanner_img3.png';



const HomePage: React.FC = () => {
    const verticalBanners = [
        { id: 1, image: img3, title: 'Banner 3' },
        { id: 2, image: img4, title: 'Banner 4' },
    ];

    const horizontalBanners = [
        { id: 1, image: img6, title: 'Banner 4' },
        { id: 2, image: img4, title: 'Banner 5' },
        { id: 3, image: img5, title: 'Banner 6' },
        { id: 4, image: img7, title: 'Banner 7' },
    ];

    return (
        <div className="homepage-container">
            <div className="homepage-top-section">
                <div className="main-slider-column">
                    <HomeSlider />
                </div>
                <div className="small-banners-column">
                    <SmallBanners banners={verticalBanners} layout="vertical" />
                </div>
            </div>
            
            <SmallBanners banners={horizontalBanners} layout="horizontal" />
            
            <FlashSale />

            {/* Các phần khác như Sách mới, Sách bán chạy sẽ thêm ở đây */}
            <div className="homepage-content">
                <section className="book-section">
                    <h2 className="section-title">Sách Mới Cập Nhật</h2>
                    <div className="placeholder-books">
                        {/* BookList component sẽ được đặt ở đây */}
                        <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                            Danh sách sách đang được tải...
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
