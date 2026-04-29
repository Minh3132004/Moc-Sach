import React from 'react';
import HomeSlider from './HomeSlider';
import SmallBanners from './SmallBanners';
import './HomePage.css';

const HomePage: React.FC = () => {
    return (
        <div className="homepage-container">
            <div className="homepage-top-section">
                <div className="main-slider-column">
                    <HomeSlider />
                </div>
                <div className="small-banners-column">
                    <SmallBanners />
                </div>
            </div>
            
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
