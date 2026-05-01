import React, { useState } from 'react';
import './FlashSalePage.css';
import { Link } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useFlashSaleBooks } from '../../features/book/hooks';
import FlashSaleItem from '../../components/homepage/flashsale/FlashSaleItem';
import banner1 from '../../assets/banners/bannner1.png';
import Pagination from '../../components/pagination/Pagination';

const FlashSalePage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const size = 10; // Số lượng sản phẩm mỗi trang

    const { data: flashSaleData, isLoading, isError } = useFlashSaleBooks(size, currentPage - 1);

    const handlePagination = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    if (isLoading) return <div className="loading-container">Đang tải dữ liệu Flash Sale...</div>;
    if (isError) return <div className="error-container">Lỗi tải dữ liệu Flash Sale!</div>;

    const books = flashSaleData?.bookList || [];
    const totalPages = flashSaleData?.totalPages || 0;

    return (
        <div className="flash-sale-page">
            <div className="container">
                <nav className="breadcrumb">
                    <Link to="/">TRANG CHỦ</Link>
                    <ArrowForwardIosIcon className="breadcrumb-icon" />
                    <span className="breadcrumb-current">FLASHSALE</span>
                </nav>

                <div className="flash-sale-banner-container">
                    <img src={banner1} alt="Flash Sale Banner" className="flash-sale-banner" />
                </div>

                {books.length === 0 ? (
                    <div className="flash-sale-empty">
                        Hiện chưa có sản phẩm Flash Sale nào. Vui lòng quay lại sau.
                    </div>
                ) : (
                    <>
                        <div className="flash-sale-grid">
                            {books.map(book => (
                                <FlashSaleItem key={book.idBook} book={book} />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                handlePagination={handlePagination}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FlashSalePage;
