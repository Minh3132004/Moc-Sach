import React from 'react';
import { Link } from 'react-router-dom';
import './FlashSale.css';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { useImagesByBook } from '../../../features/image/hooks';
import BookModel from '../../../features/book/model/BookModel';
import { toast } from 'react-toastify';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useFavoriteBooksByUser } from '../../../features/favorite/hooks/useFavoriteBooksByUser';
import { useAddFavoriteBook } from '../../../features/favorite/hooks/useAddFavoriteBook';
import { useRemoveFavoriteBook } from '../../../features/favorite/hooks/useRemoveFavoriteBook';

interface FlashSaleItemProps {
    book: BookModel;
}

const FlashSaleItem: React.FC<FlashSaleItemProps> = ({ book }) => {
    const placeholderImageUrl = "https://via.placeholder.com/180x240?text=No+Image";
    const { data: images } = useImagesByBook(book.idBook);
    const firstImage = images && images.length > 0 ? images[0] : undefined;
    const imageUrl = firstImage?.urlImage || placeholderImageUrl;

    // Lấy thông tin user từ AuthContext
    const { user } = useAuth();
    const idUser = user?.id;

    // Lấy danh sách sách yêu thích của user để kiểm tra trạng thái
    const { data: favoriteBooks, isError: favoriteBooksError, error: favoriteBooksErrorObj } = useFavoriteBooksByUser(idUser);
    const isFavorited = favoriteBooks?.some(fb => fb.idBook === book.idBook) ?? false;

    // Hook thêm / xóa yêu thích
    const { mutate: addFavorite, isPending: isAdding } = useAddFavoriteBook();
    const { mutate: removeFavorite, isPending: isRemoving } = useRemoveFavoriteBook();
    const isFavoritePending = isAdding || isRemoving;

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

        if (!idUser) {
            toast.warning("Vui lòng đăng nhập để sử dụng tính năng yêu thích!");
            return;
        }

        if (isFavoritePending) return;

        if (isFavorited) {
            removeFavorite(
                { idUser, idBook: book.idBook },
                {
                    onSuccess: () => toast.success(`Đã xóa "${book.nameBook}" khỏi danh sách yêu thích!`),
                    onError: (err: any) => toast.error(err?.message || "Không thể xóa khỏi yêu thích!"),
                }
            );
        } else {
            addFavorite(
                { idUser, idBook: book.idBook },
                {
                    onSuccess: () => toast.success(`Đã thêm "${book.nameBook}" vào danh sách yêu thích!`),
                    onError: (err: any) => toast.error(err?.message || "Không thể thêm vào yêu thích!"),
                }
            );
        }
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
                    <button
                        className={`wishlist-btn ${isFavorited ? 'active' : ''}`}
                        onClick={handleAddToWishlist}
                        title={isFavorited ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                        disabled={isFavoritePending}
                    >
                        <FavoriteIcon
                            sx={{ fontSize: 18 }}
                            style={{ color: isFavorited ? '#e53e3e' : undefined }}
                        />
                    </button>
                </div>
                <div className="item-title">{book.nameBook}</div>
                {favoriteBooksError && (
                    <div style={{ marginTop: 4, color: "#b91c1c", fontSize: 11 }}>
                        {favoriteBooksErrorObj instanceof Error ? favoriteBooksErrorObj.message : "Không thể tải danh sách yêu thích."}
                    </div>
                )}
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
