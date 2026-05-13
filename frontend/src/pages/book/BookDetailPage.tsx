import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Rating from "@mui/material/Rating";
import Divider from "@mui/material/Divider";
import { toast } from "react-toastify";

import FlashSaleItem from "../../components/homepage/flashsale/FlashSaleItem";
import { useBookById, useHotBooks } from "../../features/book/hooks";
import { useHotBooksByGenre } from "../../features/book/hooks/useHotBooksByGenre";
import { useImagesByBook } from "../../features/image/hooks";
import { useReviewsByBook } from "../../features/review/hooks";
import { useAddCartItem } from "../../features/cart/hooks";
import { useAuth } from "../../app/providers/AuthProvider";
import { useFavoriteBooksByUser } from "../../features/favorite/hooks/useFavoriteBooksByUser";
import { useAddFavoriteBook } from "../../features/favorite/hooks/useAddFavoriteBook";
import { useRemoveFavoriteBook } from "../../features/favorite/hooks/useRemoveFavoriteBook";
import ImageModel from "../../features/image/model/ImageModel";
import "./BookDetailPage.css";

const PLACEHOLDER_IMG = "https://via.placeholder.com/400x520?text=No+Image";

/**
 * Chuyển đổi đối tượng ImageModel thành đường dẫn URL hiển thị được.
 * Nếu không có ảnh, trả về ảnh mặc định (placeholder).
 */
function imageUrl(img: ImageModel | undefined): string {
  if (!img || !img.urlImage) return PLACEHOLDER_IMG;
  return img.urlImage;
}

const SERVICE_POLICIES = [
  "Thời gian giao hàng: Giao nhanh và uy tín",
  "Chính sách đổi trả: Đổi trả miễn phí toàn quốc",
  "Chính sách khách sỉ: Ưu đãi khi mua số lượng lớn",
];

const PROMO_CHIPS = ["Mã giảm 20%", "Mã giảm 30%", "Mã giảm 10%", "Mã giảm 40%"];

const BookDetailPage: React.FC = () => {
  // Lấy idBook từ URL (ví dụ: /books/123 => idBook = 123)
  const { idBook: idParam } = useParams<{ idBook: string }>();
  const idBook = Number(idParam);
  const invalidId = !Number.isFinite(idBook) || idBook <= 0; //Kiểm tra lại tính hợp lệ của id

  // Lấy thông tin user hiện tại từ AuthContext để phục vụ tính năng Giỏ hàng
  const { user } = useAuth();
  const idUser = user?.id;

  // FETCH DỮ LIỆU: Gọi API lấy thông tin sách, hình ảnh và đánh giá
  const { data: book, isLoading, isError, error } = useBookById(invalidId ? undefined : idBook);
  const { data: images, isLoading: imagesLoading } = useImagesByBook(invalidId ? undefined : idBook);
  const { data: reviews, isLoading: reviewsLoading, isError: reviewsError, error: reviewsErrorObj } = useReviewsByBook(invalidId ? undefined : idBook);

  const [activeImageIndex, setActiveImageIndex] = useState(0); // Ảnh đang được chọn hiển thị
  const [quantity, setQuantity] = useState(1); // Số lượng người dùng muốn mua

  // Lấy danh sách sách yêu thích & hook thêm/xóa
  const { data: favoriteBooks, isError: favoriteBooksError, error: favoriteBooksErrorObj } = useFavoriteBooksByUser(idUser);
  const isFavorite = favoriteBooks?.some(fb => fb.idBook === idBook) ?? false;
  const { mutate: addFavorite, isPending: isAdding } = useAddFavoriteBook();
  const { mutate: removeFavorite, isPending: isRemoving } = useRemoveFavoriteBook();
  const isFavoritePending = isAdding || isRemoving;

  // Reset lại trạng thái trang khi người dùng chuyển sang xem sách khác
  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
  }, [idBook]);

  // Xử lý danh sách ảnh: Đưa ảnh Thumbnail (ảnh đại diện) lên đầu danh sách
  const sortedImages = useMemo(() => {
    if (!images?.length) return [];
    return [...images].sort((a, b) => Number(!!b.thumbnail) - Number(!!a.thumbnail));
  }, [images]);

  const mainImage = sortedImages[activeImageIndex] ?? sortedImages[0];

  // Kiểm tra số lượng tồn kho để không cho người dùng chọn mua quá số lượng đang có
  const maxQty = book?.quantity ?? 0;
  useEffect(() => {
    if (maxQty > 0 && quantity > maxQty) {
      setQuantity(maxQty);
    }
  }, [maxQty, quantity]);

  // XỬ LÝ SÁCH LIÊN QUAN: Tìm các sách cùng thể loại hoặc sách đang hot
  const firstGenreId = book?.genres?.[0]?.idGenre ?? null;
  const { data: relatedByGenre, isError: relatedByGenreError, error: relatedByGenreErrorObj } = useHotBooksByGenre(firstGenreId, 10, 0);
  const { data: relatedHot, isError: relatedHotError, error: relatedHotErrorObj } = useHotBooks(10, 0, Boolean(book) && firstGenreId === null);

  // Lọc bỏ cuốn sách hiện tại ra khỏi danh sách sách liên quan
  const relatedBooks = useMemo(() => {
    const list = firstGenreId !== null ? relatedByGenre?.bookList : relatedHot?.bookList;
    if (!list || !book) return [];
    return list.filter((item) => item.idBook !== book.idBook).slice(0, 10);
  }, [firstGenreId, relatedByGenre, relatedHot, book]);

  // MUTATION: Xử lý việc gửi yêu cầu thêm vào giỏ hàng lên server
  const addMutation = useAddCartItem();

  if (invalidId) {
    return (
      <div className="book-detail-page">
        <div className="container book-detail-error">Mã sách không hợp lệ.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="book-detail-page">
        <div className="container book-detail-loading">Đang tải thông tin sách…</div>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="book-detail-page">
        <div className="container book-detail-error">
          {error instanceof Error ? error.message : "Không tìm thấy sách."}
        </div>
      </div>
    );
  }

  const soldOut = (book.quantity ?? 0) <= 0;
  const reviewCount = reviews?.length ?? 0;
  const relatedErrorMessage = firstGenreId !== null
    ? (relatedByGenreErrorObj instanceof Error ? relatedByGenreErrorObj.message : "Không thể tải danh sách sách cùng thể loại.")
    : (relatedHotErrorObj instanceof Error ? relatedHotErrorObj.message : "Không thể tải danh sách sách hot.");
  const showRelatedError = firstGenreId !== null ? relatedByGenreError : relatedHotError;
  const favoriteBooksErrorMessage = favoriteBooksErrorObj instanceof Error
    ? favoriteBooksErrorObj.message
    : "Không thể tải danh sách yêu thích.";
  const detailItems: Array<{ label: string; value: string }> = [
    { label: "Tác giả", value: book.author ?? "Đang cập nhật" },
    { label: "Giá bán", value: `${(book.sellPrice ?? 0).toLocaleString("vi-VN")} đ` },
    { label: "Đã bán", value: `${book.soldQuantity ?? 0}` },
    { label: "Đánh giá", value: `${(book.avgRating ?? 0).toFixed(1)} / 5` },
    {
      label: "Thể loại",
      value: book.genres?.map((genre) => genre.nameGenre).filter(Boolean).join(", ") || "Đang cập nhật",
    },
  ];

  // Tính toán tỷ lệ phần trăm đánh giá theo số sao (5 sao chiếm bao nhiêu %, 4 sao bao nhiêu %...)
  const ratingPercentages = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews?.filter((review) => Math.round(review.ratingPoint) === star).length ?? 0;
    const percent = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
    return { star, percent };
  });

  /**
   * Thực hiện thêm sản phẩm vào giỏ hàng khi người dùng nhấn nút.
   */
  const handleAddToCart = () => {
    if (soldOut) return;
    addMutation.mutate(
      { idUser, idBook: book!.idBook, quantity },
      {
        onError: (err: any) => toast.error(err?.message || "Không thể thêm vào giỏ hàng"),
      }
    );
  };

  /**
   * Xử lý bật/tắt yêu thích sách.
   */
  const handleToggleFavorite = () => {
    if (!idUser) {
      toast.warning("Vui lòng đăng nhập để sử dụng tính năng yêu thích!");
      return;
    }
    if (isFavoritePending) return;

    if (isFavorite) {
      removeFavorite(
        { idUser, idBook: book!.idBook },
        {
          onSuccess: () => toast.success(`Đã xóa "${book!.nameBook}" khỏi danh sách yêu thích!`),
          onError: (err: any) => toast.error(err?.message || "Không thể xóa khỏi yêu thích!"),
        }
      );
    } else {
      addFavorite(
        { idUser, idBook: book!.idBook },
        {
          onSuccess: () => toast.success(`Đã thêm "${book!.nameBook}" vào danh sách yêu thích!`),
          onError: (err: any) => toast.error(err?.message || "Không thể thêm vào yêu thích!"),
        }
      );
    }
  };

  return (
    <div className="book-detail-page">
      <div className="container">
        <nav className="breadcrumb book-detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">TRANG CHỦ</Link>
          <ArrowForwardIosIcon className="breadcrumb-icon" aria-hidden />
          {book.genres?.[0]?.nameGenre ? (
            <>
              <Link to={`/books?genreIds=${book.genres[0].idGenre}`}>
                {book.genres[0].nameGenre.toUpperCase()}
              </Link>
              <ArrowForwardIosIcon className="breadcrumb-icon" aria-hidden />
            </>
          ) : null}
          <span className="breadcrumb-current book-detail-breadcrumb-title">{book.nameBook?.toUpperCase()}</span>
        </nav>

        <div className="book-detail-two-columns">
          <aside className="book-detail-left">
            <div className="book-detail-gallery-card">
              <div className="book-detail-main-image-wrap">
                {imagesLoading ? (
                  <div className="book-detail-image-skeleton" />
                ) : (
                  <>
                    <img src={imageUrl(mainImage)} alt={book.nameBook ?? ""} className="book-detail-main-image" />
                    <button
                      type="button"
                      className={`book-detail-floating-favorite ${isFavorite ? "is-favorite" : ""}`}
                      onClick={handleToggleFavorite}
                      title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                      disabled={isFavoritePending}
                    >
                      {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                    </button>
                  </>
                )}
              </div>

              {sortedImages.length > 1 ? (
                <div className="book-detail-thumbs">
                  {sortedImages.slice(0, 5).map((img, index) => (
                    <button
                      key={img.idImage}
                      type="button"
                      className={`book-detail-thumb ${index === activeImageIndex ? "is-active" : ""}`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img src={imageUrl(img)} alt="" />
                    </button>
                  ))}
                  {sortedImages.length > 5 ? <div className="book-detail-thumb-more">+{sortedImages.length - 5}</div> : null}
                </div>
              ) : null}

              <div className="book-detail-action-row">
                <button
                  type="button"
                  className="book-detail-btn-outline"
                  disabled={soldOut || addMutation.isPending}
                  onClick={handleAddToCart}
                >
                  <ShoppingCartOutlinedIcon fontSize="small" />
                  Thêm vào giỏ hàng
                </button>
                <button type="button" className="book-detail-btn-solid" disabled={soldOut} onClick={handleAddToCart}>
                  <BoltOutlinedIcon fontSize="small" />
                  Mua ngay
                </button>
              </div>
              {favoriteBooksError && (
                <p style={{ marginTop: 10, color: "#b91c1c", fontSize: 12 }}>
                  {favoriteBooksErrorMessage}
                </p>
              )}
            </div>

            <div className="book-detail-policy-card">
              <h3>Chính sách ưu đãi của Mộc Sách</h3>
              <ul>
                {SERVICE_POLICIES.map((policy) => (
                  <li key={policy}>{policy}</li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="book-detail-right">
            <div className="book-detail-buy-card">
              <h1 className="book-detail-title">{book.nameBook}</h1>
              <div className="book-detail-meta-grid">
                <p>Tác giả: <strong>{book.author ?? "Đang cập nhật"}</strong></p>
                <p>Tình trạng: <strong>{soldOut ? "Hết hàng" : "Còn hàng"}</strong></p>
              </div>

              <div className="book-detail-rating-row">
                <Rating value={book.avgRating ?? 0} precision={0.5} readOnly size="small" />
                <span>({reviewCount} đánh giá)</span>
                <Divider orientation="vertical" flexItem />
                <span>Đã bán {book.soldQuantity ?? 0}</span>
              </div>

              <div className="book-detail-price-row">
                <span className="book-detail-sell-price">{(book.sellPrice ?? 0).toLocaleString("vi-VN")} đ</span>
                <span className="book-detail-list-price">{(book.listPrice ?? 0).toLocaleString("vi-VN")} đ</span>
                {(book.discountPercent ?? 0) > 0 ? (
                  <span className="book-detail-discount-pill">-{book.discountPercent}%</span>
                ) : null}
              </div>

              <p className="book-detail-promo-message">Chính sách khuyến mãi có thể thay đổi theo từng thời điểm.</p>

              <div className="book-detail-shipping-box">
                <h3>Thông tin vận chuyển</h3>
                <p>Giao hàng tiêu chuẩn toàn quốc, dự kiến 2-5 ngày làm việc.</p>
              </div>

              <div className="book-detail-promo-chips">
                {PROMO_CHIPS.map((chip) => (
                  <span key={chip}>{chip}</span>
                ))}
              </div>

              <div className="book-detail-qty-row">
                <span className="book-detail-qty-label">Số lượng:</span>
                <div className="book-detail-qty-controls">
                  <button
                    type="button"
                    className="book-detail-qty-btn"
                    disabled={quantity <= 1 || soldOut}
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <span className="book-detail-qty-value">{soldOut ? 0 : quantity}</span>
                  <button
                    type="button"
                    className="book-detail-qty-btn"
                    disabled={soldOut || quantity >= maxQty}
                    onClick={() => setQuantity((prev) => Math.min(maxQty, prev + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <section className="book-detail-section-card">
              <h2 className="book-detail-section-title">Thông tin chi tiết</h2>
              <table className="book-detail-info-table">
                <tbody>
                  {detailItems.map((item) => (
                    <tr key={item.label}>
                      <th>{item.label}</th>
                      <td>{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="book-detail-section-card">
              <h2 className="book-detail-section-title">Mô tả sản phẩm</h2>
              {book.description ? (
                <p className="book-detail-description">{book.description}</p>
              ) : (
                <p className="book-detail-empty">Chưa có mô tả cho sách này.</p>
              )}
            </section>
          </section>
        </div>

        <section className="book-detail-section-card book-detail-review-section">
          <h2 className="book-detail-section-title">Đánh giá sản phẩm</h2>
          {reviewsLoading ? (
            <p>Đang tải đánh giá…</p>
          ) : reviewsError ? (
            <p style={{ color: "#b91c1c" }}>
              {reviewsErrorObj instanceof Error ? reviewsErrorObj.message : "Không thể tải đánh giá."}
            </p>
          ) : (
            <>
              <div className="book-detail-review-summary">
                <div className="book-detail-review-average">
                  <strong>{(book.avgRating ?? 0).toFixed(1)}</strong>
                  <span>/5</span>
                  <Rating value={book.avgRating ?? 0} precision={0.5} readOnly size="small" />
                  <p>({reviewCount} đánh giá)</p>
                </div>
                <div className="book-detail-review-bars">
                  {ratingPercentages.map((item) => (
                    <div key={item.star} className="book-detail-review-bar-item">
                      <span>{item.star} sao</span>
                      <div className="book-detail-review-bar-track">
                        <div className="book-detail-review-bar-fill" style={{ width: `${item.percent}%` }} />
                      </div>
                      <span>{item.percent}%</span>
                    </div>
                  ))}
                </div>
                <div className="book-detail-review-action">
                  <button type="button" className="book-detail-review-btn">
                    <BorderColorOutlinedIcon fontSize="small" />
                    Viết đánh giá
                  </button>
                </div>
              </div>

              {reviews && reviews.length > 0 && (
                <div className="book-detail-review-list">
                  <h3 className="book-detail-review-list-title">Khách hàng nhận xét</h3>
                  {reviews.map((review) => (
                    <div key={review.idReview} className="book-detail-review-item">
                      <div className="book-detail-review-user-info">
                        <img 
                          src={review.user?.avatar || "https://via.placeholder.com/40?text=U"} 
                          alt="avatar" 
                          className="book-detail-review-avatar" 
                        />
                        <div className="book-detail-review-user-meta">
                          <span className="book-detail-review-user-name">
                            {review.user?.lastName} {review.user?.firstName}
                          </span>
                          <div className="book-detail-review-item-header">
                            <Rating value={review.ratingPoint} readOnly size="small" />
                            <span className="book-detail-review-date">
                              {new Date(review.timestamp).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="book-detail-review-content">{review.content}</p>
                      <Divider className="book-detail-divider" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {showRelatedError ? (
          <div className="book-detail-error" style={{ marginTop: 20 }}>
            {relatedErrorMessage}
          </div>
        ) : null}
        {relatedBooks.length > 0 ? (
          <>
            <section className="book-detail-related">
              <h2 className="book-detail-related-title">Mộc Sách giới thiệu</h2>
              <div className="book-detail-related-grid">
                {relatedBooks.slice(0, 5).map((item) => (
                  <FlashSaleItem key={item.idBook} book={item} />
                ))}
              </div>
            </section>
            <section className="book-detail-related book-detail-related-alt">
              <h2 className="book-detail-related-title">Gợi ý cho bạn</h2>
              <div className="book-detail-related-grid">
                {relatedBooks.map((item) => (
                  <FlashSaleItem key={`suggest-${item.idBook}`} book={item} />
                ))}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default BookDetailPage;
