import React, { useState, useEffect } from 'react';
import './FlashSale.css';
import { Link } from 'react-router-dom';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useFlashSaleBooks } from '../../../features/book/hooks';
import FlashSaleItem from './FlashSaleItem';

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

    if (books.length === 0) {
        return (
            <div className="flash-sale-container">
                <div className="flash-sale-header">
                    <div className="flash-sale-title-group">
                        <h2 className="flash-sale-title">
                            FL<FlashOnIcon style={{ color: '#ffbf00', fontSize: '28px' }} />SH <span>SALE</span>
                        </h2>
                    </div>
                    <Link to="/flash-sale" className="see-all-link">
                        Xem tất cả <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                    </Link>
                </div>

                <div className="flash-sale-empty-state">
                    Hiện chưa có sản phẩm Flash Sale. Vui lòng quay lại sau.
                </div>
            </div>
        );
    }

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
                <Link to="/flash-sale" className="see-all-link">
                    Xem tất cả <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                </Link>
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
