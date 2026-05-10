import React from 'react';
import { Link } from 'react-router-dom';
import './FlashSale.css';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { useImagesByBook } from '../../../features/image/hooks';
import BookModel from '../../../features/book/model/BookModel';
import { toast } from 'react-toastify';

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

    let statusText = `Đã bán ${book.soldQuantity || 0}`;
    let isSoldOut = (book.quantity || 0) === 0;
    let isAlmostOut = (book.quantity || 0) > 0 && (book.quantity || 0) <= 5;

    if (isSoldOut) {
        statusText = "Hết hàng";
    } else if (isAlmostOut) {
        statusText = "Sắp cháy hàng";
    }

    const handleAddToWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toast.info(`Đã thêm "${book.nameBook}" vào danh sách yêu thích!`);
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toast.success(`Đã thêm "${book.nameBook}" vào giỏ hàng!`);
    };

    return (
        <Link to={`/books/${book.idBook}`} className="flash-sale-item-link">
            <div className="flash-sale-item">
                <div className="item-image-wrapper">
                    <img src={imageUrl} alt={book.nameBook} className="item-image" />
                    <button className="wishlist-btn" onClick={handleAddToWishlist} title="Yêu thích">
                        <FavoriteIcon sx={{ fontSize: 18 }} />
                    </button>
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

                <div className={`sold-progress-container ${isSoldOut ? 'sold-out' : isAlmostOut ? 'almost-out' : ''}`}>
                    <div
                        className="sold-progress-bar"
                        style={{ width: isSoldOut ? '100%' : `${soldProgress}%` }}
                    ></div>
                    <div className="sold-text">
                        {isAlmostOut || isSoldOut ? (
                            <LocalFireDepartmentIcon className="fire-icon" style={{ fontSize: '14px', color: '#1f2937' }} />
                        ) : null}
                        {statusText}
                    </div>
                </div>

                <button 
                    className={`buy-now-btn ${isSoldOut ? 'disabled' : ''}`} 
                    onClick={handleBuyNow}
                    disabled={isSoldOut}
                >
                    <LocalMallIcon sx={{ fontSize: 16 }} />
                    {isSoldOut ? "Hết hàng" : "Mua ngay"}
                </button>
            </div>
        </Link>
    );
};

export default FlashSaleItem;
