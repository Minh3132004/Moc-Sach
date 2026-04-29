import React from 'react';
import './SmallBanners.css';

export interface BannerItem {
    id: number;
    image: string;
    title: string;
}

interface SmallBannersProps {
    banners: BannerItem[];
    layout: 'vertical' | 'horizontal';
}

const SmallBanners: React.FC<SmallBannersProps> = ({ banners, layout }) => {
    return (
        <div className={`small-banners-container ${layout === 'horizontal' ? 'horizontal-layout' : ''}`}>
            {banners.map((banner) => (
                <div key={banner.id} className="small-banner-item ms-book-card">
                    <img src={banner.image} alt={banner.title} />
                </div>
            ))}
        </div>
    );
};

export default SmallBanners;
