import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Rating from "@mui/material/Rating";
import Divider from "@mui/material/Divider";

import FlashSaleItem from "../../components/homepage/flashsale/FlashSaleItem";
import { getHotBook } from "../../features/book/api/bookApi";
import { useBookById } from "../../features/book/hooks";
import { useHotBooksByGenre } from "../../features/book/hooks/useHotBooksByGenre";
import { useImagesByBook } from "../../features/image/hooks";
import { useReviewsByBook } from "../../features/review/hooks";
import { addCartItem } from "../../features/cart/api/cartApi";
import ImageModel from "../../features/image/model/ImageModel";
import "./BookDetailPage.css";

const PLACEHOLDER_IMG = "https://via.placeholder.com/400x520?text=No+Image";

function imageUrl(img: ImageModel | undefined): string {
  return img?.dataImage || img?.urlImage || PLACEHOLDER_IMG;
}

const SERVICE_POLICIES = [
  "Thời gian giao hàng: Giao nhanh và uy tín",
  "Chính sách đổi trả: Đổi trả miễn phí toàn quốc",
  "Chính sách khách sỉ: Ưu đãi khi mua số lượng lớn",
];

const PROMO_CHIPS = ["Mã giảm 70K", "Mã giảm 30K", "Thanh toán ví giảm thêm"];

const BookDetailPage: React.FC = () => {
  const { idBook: idParam } = useParams<{ idBook: string }>();
  const idBook = Number(idParam);
  const invalidId = !Number.isFinite(idBook) || idBook <= 0;

  const { data: book, isLoading, isError, error } = useBookById(invalidId ? undefined : idBook);
  const { data: images, isLoading: imagesLoading } = useImagesByBook(invalidId ? undefined : idBook);
  const { data: reviews, isLoading: reviewsLoading } = useReviewsByBook(invalidId ? undefined : idBook);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
  }, [idBook]);

  const sortedImages = useMemo(() => {
    if (!images?.length) return [];
    return [...images].sort((a, b) => Number(!!b.thumbnail) - Number(!!a.thumbnail));
  }, [images]);

  const mainImage = sortedImages[activeImageIndex] ?? sortedImages[0];
  const maxQty = book?.quantity ?? 0;

  useEffect(() => {
    if (maxQty > 0 && quantity > maxQty) {
      setQuantity(maxQty);
    }
  }, [maxQty, quantity]);

  const firstGenreId = book?.genres?.[0]?.idGenre ?? null;
  const { data: relatedByGenre } = useHotBooksByGenre(firstGenreId, 10, 0);
  const { data: relatedHot } = useQuery({
    queryKey: ["books", "hot", 10, 0],
    queryFn: () => getHotBook(10, 0),
    enabled: Boolean(book) && firstGenreId === null,
  });

  const relatedBooks = useMemo(() => {
    const list = firstGenreId !== null ? relatedByGenre?.bookList : relatedHot?.bookList;
    if (!list || !book) return [];
    return list.filter((item) => item.idBook !== book.idBook).slice(0, 10);
  }, [firstGenreId, relatedByGenre, relatedHot, book]);

  const addMutation = useMutation({
    mutationFn: () => addCartItem(book!.idBook, quantity),
  });

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
  const detailItems: Array<{ label: string; value: string }> = [
    { label: "Mã hàng", value: `${book.idBook}` },
    { label: "Tác giả", value: book.author ?? "Đang cập nhật" },
    { label: "Giá niêm yết", value: `${(book.listPrice ?? 0).toLocaleString("vi-VN")} đ` },
    { label: "Giá bán", value: `${(book.sellPrice ?? 0).toLocaleString("vi-VN")} đ` },
    { label: "Số lượng tồn", value: `${book.quantity ?? 0}` },
    { label: "Đã bán", value: `${book.soldQuantity ?? 0}` },
    { label: "Đánh giá", value: `${(book.avgRating ?? 0).toFixed(1)} / 5` },
    {
      label: "Thể loại",
      value: book.genres?.map((genre) => genre.nameGenre).filter(Boolean).join(", ") || "Đang cập nhật",
    },
  ];

  const ratingPercentages = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews?.filter((review) => Math.round(review.ratingPoint) === star).length ?? 0;
    const percent = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
    return { star, percent };
  });

  const handleAddToCart = () => {
    if (soldOut) return;
    addMutation.mutate();
  };

  return (
    <div className="book-detail-page">
      <div className="container">
        <nav className="breadcrumb book-detail-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">SÁCH TIẾNG VIỆT</Link>
          <ArrowForwardIosIcon className="breadcrumb-icon" aria-hidden />
          {book.genres?.[0]?.nameGenre ? (
            <>
              <Link to="/best-sellers">{book.genres[0].nameGenre.toUpperCase()}</Link>
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
                  <img src={imageUrl(mainImage)} alt={book.nameBook ?? ""} className="book-detail-main-image" />
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
          ) : (
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
          )}
        </section>

        {relatedBooks.length > 0 ? (
          <>
            <section className="book-detail-related">
              <h2 className="book-detail-related-title">FAHASA giới thiệu</h2>
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
