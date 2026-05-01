import React, { useState } from 'react';
import './BestSellerPage.css';
import { Link } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {useHotBooks, useHotBooksByGenre} from '../../features/book/hooks';
import { useAllGenres } from '../../features/genre/hooks/useAllGenres';
import FlashSaleItem from '../../components/homepage/flashsale/FlashSaleItem';
import Pagination from '../../components/pagination/Pagination';

const BestSellerPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
    const size = 10;

    // Hook lấy sách hot (khi chọn "Tất cả")
    const { data: hotBooksData, isLoading: loadingHot, isError: errorHot } = useHotBooks(size, currentPage - 1);
    
    // Hook lấy sách theo thể loại (khi chọn thể loại cụ thể)
    const { data: genreBooksData, isLoading: loadingGenre, isError: errorGenre } = useHotBooksByGenre(selectedGenre, size, currentPage - 1);

    const handlePagination = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleGenreChange = (genreId: number | null) => {
        setSelectedGenre(genreId);
        setCurrentPage(1); // Reset về trang 1 khi đổi thể loại
    };

    const isLoading = selectedGenre === null ? loadingHot : loadingGenre;
    const isError = selectedGenre === null ? errorHot : errorGenre;
    const { data: genres } = useAllGenres();

    if (isLoading) return <div className="loading-container">Đang tải dữ liệu Sách bán chạy...</div>;
    if (isError) return <div className="error-container">Lỗi tải dữ liệu!</div>;

    const books = (selectedGenre === null ? hotBooksData?.bookList : genreBooksData?.bookList) || [];
    const totalPages = (selectedGenre === null ? hotBooksData?.totalPages : genreBooksData?.totalPages) || 0;

    return (
        <div className="bestseller-page">
            <div className="container">
                <nav className="breadcrumb">
                    <Link to="/">TRANG CHỦ</Link>
                    <ArrowForwardIosIcon className="breadcrumb-icon" />
                    <span className="breadcrumb-current">SÁCH BÁN CHẠY</span>
                </nav>

                <div className="bestseller-header-container">
                    <div className="bs-page-header-top">
                        <TrendingUpIcon className="bs-page-trending-icon" />
                        <span className="bs-page-header-title">SÁCH BÁN CHẠY</span>
                    </div>
                    
                    <div className="bs-page-genre-bar">
                        <button 
                            className={`genre-item ${selectedGenre === null ? 'active' : ''}`}
                            onClick={() => handleGenreChange(null)}
                        >
                            Tất cả
                        </button>
                        {genres?.map((genre) => (
                            <button 
                                key={genre.idGenre}
                                className={`genre-item ${selectedGenre === genre.idGenre ? 'active' : ''}`}
                                onClick={() => handleGenreChange(genre.idGenre)}
                            >
                                {genre.nameGenre}
                            </button>
                        ))}
                    </div>
                </div>

                {books.length === 0 ? (
                    <div className="bestseller-empty">
                        Hiện chưa có dữ liệu sách bán chạy.
                    </div>
                ) : (
                    <>
                        <div className="bestseller-grid">
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

export default BestSellerPage;
