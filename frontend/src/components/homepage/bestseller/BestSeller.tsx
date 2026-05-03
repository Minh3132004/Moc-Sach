import React from 'react';
import './BestSeller.css';
import { Link } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useHotBooks } from '../../../features/book/hooks';
import FlashSaleItem from '../flashsale/FlashSaleItem';

const BestSeller: React.FC = () => {
    const { data: bestSellerData, isLoading, isError, error } = useHotBooks(5, 0);

    if (isLoading) return <div className="bs-loading">Đang tải sách bán chạy...</div>;
    if (isError) return <div className="bs-error">Lỗi: {error instanceof Error ? error.message : "Lỗi tải dữ liệu!"}</div>;

    const books = bestSellerData?.bookList || [];
    const hasBooks = books.length > 0;

    return (
        <div className="bs-container">
            <div className="bs-header-top">
                <TrendingUpIcon className="bs-trending-icon" />
                <span className="bs-header-title">Sách Bán Chạy</span>
            </div>
            
            <div className="bs-content">
                {hasBooks ? (
                    <div className="bs-grid">
                        {books.map(book => (
                            <FlashSaleItem key={book.idBook} book={book} />
                        ))}
                    </div>
                ) : (
                    <div className="bs-empty-state">Chưa có sách bán chạy</div>
                )}
                <div className="bs-see-all">
                    <Link to="/best-sellers" className="bs-link">
                        Xem thêm <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BestSeller;
