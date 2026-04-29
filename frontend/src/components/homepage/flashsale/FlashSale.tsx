import React, { useState, useEffect } from 'react';
import './FlashSale.css';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useFlashSaleBooks } from '../../../features/book/hooks';
import { useImagesByBook } from '../../../features/image/hooks';
import BookModel from '../../../features/book/model/BookModel';

interface FlashSaleItemProps {
    book: BookModel;
}

const FlashSaleItem: React.FC<FlashSaleItemProps> = ({ book }) => {
    const placeholderImageUrl = "https://via.placeholder.com/180x240?text=No+Image";
    const { data: images } = useImagesByBook(book.idBook);
    const firstImage = images && images.length > 0 ? images[0] : undefined;
    const imageUrl = firstImage?.dataImage || firstImage?.urlImage || placeholderImageUrl;

    // Tính toán tiến trình bán hàng (giả lập total = quantity + soldQuantity)
    const total = (book.quantity || 0) + (book.soldQuantity || 0);
    const soldProgress = total > 0 ? ((book.soldQuantity || 0) / total) * 100 : 0;

    return (
        <div className="flash-sale-item">
            <div className="item-image-wrapper">
                <img src={imageUrl} alt={book.nameBook} className="item-image" />
            </div>
            <div className="item-title">{book.nameBook}</div>
            <div className="item-price-row">
                <span className="current-price">{(book.sellPrice || 0).toLocaleString('vi-VN')} đ</span>
                {book.discountPercent && book.discountPercent > 0 ? (
                    <span className="discount-badge">-{book.discountPercent}%</span>
                ) : null}
            </div>
            <div className="original-price">
                {book.listPrice ? `${book.listPrice.toLocaleString('vi-VN')} đ` : ''}
            </div>

            <div className="sold-progress-container">
                <div
                    className="sold-progress-bar"
                    style={{ width: `${soldProgress}%` }}
                ></div>
                <div className="sold-text">
                    <LocalFireDepartmentIcon className="fire-icon" style={{ fontSize: '14px', color: '#fff' }} />
                    Đã bán {book.soldQuantity || 0}
                </div>
            </div>
        </div>
    );
};

/**
 * Props cho component FlashSale
 * - `displaySeconds` quy định thời gian đếm ngược chỉ để hiển thị (đơn vị giây)
 */
interface FlashSaleProps {
    /** đếm ngược chỉ để hiển thị, đơn vị giây (chỉ phía client) */
    displaySeconds?: number;
}


const FlashSale: React.FC<FlashSaleProps> = ({ displaySeconds = 18 * 3600 }) => {
    // remainingSeconds: số giây còn lại do client quản lý, chỉ để hiển thị
    const [remainingSeconds, setRemainingSeconds] = useState<number>(displaySeconds);
    const { data: flashSaleData, isLoading, isError } = useFlashSaleBooks(5);

    // Reset bộ đếm hiển thị khi prop thay đổi (hiếm dùng nhưng tiện cho kiểm thử)
    useEffect(() => {
        setRemainingSeconds(displaySeconds);
    }, [displaySeconds]);

    // Giảm remainingSeconds mỗi giây. Effect này không gọi API hay gây side-effect
    // mạng; khi về 0 ta chỉ dừng lại ở 0.
    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingSeconds(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Hàm trợ giúp: định dạng đơn vị thời gian thành hai chữ số (ví dụ 5 -> "05")
    const formatTime = (time: number) => time.toString().padStart(2, '0');

    if (isLoading) return <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu Flash Sale...</div>;
    if (isError) return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Lỗi tải dữ liệu Flash Sale!</div>;

    const books = flashSaleData?.bookList || [];

    if (books.length === 0) return null;

    return (
        <div className="flash-sale-container">
            <div className="flash-sale-header">
                <div className="flash-sale-title-group">
                    <h2 className="flash-sale-title">
                        FL<FlashOnIcon style={{ color: '#ffbf00', fontSize: '28px' }} />SH <span>SALE</span>
                    </h2>
                    <div className="countdown-timer">
                        Kết thúc trong
                        {(() => {
                            const hrs = Math.floor(remainingSeconds / 3600);
                            const mins = Math.floor((remainingSeconds % 3600) / 60);
                            const secs = remainingSeconds % 60;
                            return (
                                <>
                                    <span className="time-box">{formatTime(hrs)}</span>
                                    <span className="time-colon">:</span>
                                    <span className="time-box">{formatTime(mins)}</span>
                                    <span className="time-colon">:</span>
                                    <span className="time-box">{formatTime(secs)}</span>
                                </>
                            );
                        })()}
                    </div>
                </div>
                <a href="/flash-sale" className="see-all-link">
                    Xem tất cả <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                </a>
            </div>

            <div className="flash-sale-items">
                {books.map(book => (
                    <FlashSaleItem key={book.idBook} book={book} />
                ))}
            </div>
        </div>
    );
};

export default FlashSale;
