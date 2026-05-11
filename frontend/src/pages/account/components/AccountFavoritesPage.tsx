import React from "react";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { toast } from "react-toastify";

import { useAuth } from "../../../app/providers/AuthProvider";
import { useFavoriteBooksByUser } from "../../../features/favorite/hooks/useFavoriteBooksByUser";
import { useRemoveFavoriteBook } from "../../../features/favorite/hooks/useRemoveFavoriteBook";
import { useBookById } from "../../../features/book/hooks/useBookById";
import { useImagesByBook } from "../../../features/image/hooks";
import "./AccountFavoritesPage.css";

const PLACEHOLDER_IMG = "https://via.placeholder.com/160x220?text=No+Image";

// ─── Card từng cuốn sách yêu thích ─────────────────────────────────────────
interface FavoriteBookCardProps {
  idBook: number;
  idUser: number;
}

const FavoriteBookCard: React.FC<FavoriteBookCardProps> = ({ idBook, idUser }) => {
  const { data: book } = useBookById(idBook);
  const { data: images } = useImagesByBook(idBook);
  const { mutate: removeFavorite, isPending } = useRemoveFavoriteBook();

  const firstImage = images && images.length > 0 ? images[0] : undefined;
  const imageUrl = firstImage?.urlImage || firstImage?.dataImage || PLACEHOLDER_IMG;

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;
    removeFavorite(
      { idUser, idBook },
      {
        onSuccess: () => toast.success(`Đã xóa "${book?.nameBook || "sách"}" khỏi danh sách yêu thích!`),
        onError: (err: any) => toast.error(err?.message || "Không thể xóa khỏi yêu thích!"),
      }
    );
  };

  if (!book) {
    return (
      <div className="fav-card fav-card--skeleton">
        <div className="fav-card__img-skeleton" />
        <div className="fav-card__body-skeleton">
          <div className="fav-card__line" />
          <div className="fav-card__line fav-card__line--short" />
        </div>
      </div>
    );
  }

  const isSoldOut = (book.quantity ?? 0) <= 0;

  return (
    <Link to={`/books/${idBook}`} className="fav-card">
      {/* Nút xóa yêu thích */}
      <button
        className={`fav-card__remove-btn${isPending ? " fav-card__remove-btn--loading" : ""}`}
        onClick={handleRemove}
        title="Xóa khỏi yêu thích"
        disabled={isPending}
      >
        <FavoriteIcon sx={{ fontSize: 18 }} />
      </button>

      {/* Badge hết hàng */}
      {isSoldOut && <span className="fav-card__sold-out-badge">Hết hàng</span>}

      {/* Badge giảm giá */}
      {(book.discountPercent ?? 0) > 0 && (
        <span className="fav-card__discount-badge">-{book.discountPercent}%</span>
      )}

      {/* Ảnh sách */}
      <div className="fav-card__img-wrap">
        <img src={imageUrl} alt={book.nameBook ?? ""} className="fav-card__img" />
      </div>

      {/* Nội dung */}
      <div className="fav-card__body">
        <p className="fav-card__name">{book.nameBook}</p>
        <p className="fav-card__author">{book.author ?? "Không rõ tác giả"}</p>

        {/* Rating */}
        <div className="fav-card__rating">
          <StarIcon sx={{ fontSize: 14, color: "#f59e0b" }} />
          <span>{(book.avgRating ?? 0).toFixed(1)}</span>
          <span className="fav-card__sold">· Đã bán {book.soldQuantity ?? 0}</span>
        </div>

        {/* Giá */}
        <div className="fav-card__price-row">
          <span className="fav-card__sell-price">
            {(book.sellPrice ?? 0).toLocaleString("vi-VN")} đ
          </span>
          {(book.listPrice ?? 0) > (book.sellPrice ?? 0) && (
            <span className="fav-card__list-price">
              {(book.listPrice ?? 0).toLocaleString("vi-VN")} đ
            </span>
          )}
        </div>

        {/* Nút mua */}
        <button
          className={`fav-card__buy-btn${isSoldOut ? " fav-card__buy-btn--disabled" : ""}`}
          disabled={isSoldOut}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isSoldOut) toast.success(`Đã thêm "${book.nameBook}" vào giỏ hàng!`);
          }}
        >
          <ShoppingCartOutlinedIcon sx={{ fontSize: 16 }} />
          {isSoldOut ? "Hết hàng" : "Thêm vào giỏ"}
        </button>
      </div>
    </Link>
  );
};

// ─── Trang chính ─────────────────────────────────────────────────────────────
function AccountFavoritesPage() {
  const { user } = useAuth();
  const idUser = user?.id;

  const { data: favoriteBooks, isLoading } = useFavoriteBooksByUser(idUser);

  // ── Chưa đăng nhập ──
  if (!idUser) {
    return (
      <div className="fav-page">
        <div className="fav-page__empty">
          <FavoriteIcon className="fav-page__empty-icon" />
          <h3>Vui lòng đăng nhập</h3>
          <p>Bạn cần đăng nhập để xem danh sách sách yêu thích.</p>
          <Link to="/login" className="fav-page__login-btn">Đăng nhập ngay</Link>
        </div>
      </div>
    );
  }

  // ── Đang tải ──
  if (isLoading) {
    return (
      <div className="fav-page">
        <div className="fav-page__header">
          <FavoriteIcon className="fav-page__header-icon" />
          <h3 className="fav-page__title">Sản phẩm yêu thích</h3>
        </div>
        <div className="fav-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="fav-card fav-card--skeleton">
              <div className="fav-card__img-skeleton" />
              <div className="fav-card__body-skeleton">
                <div className="fav-card__line" />
                <div className="fav-card__line fav-card__line--short" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Không có sách yêu thích ──
  if (!favoriteBooks || favoriteBooks.length === 0) {
    return (
      <div className="fav-page">
        <div className="fav-page__header">
          <FavoriteIcon className="fav-page__header-icon" />
          <h3 className="fav-page__title">Sản phẩm yêu thích</h3>
        </div>
        <div className="fav-page__empty">
          <FavoriteIcon className="fav-page__empty-icon fav-page__empty-icon--gray" />
          <h3>Chưa có sách yêu thích</h3>
          <p>Hãy khám phá và thêm những cuốn sách bạn yêu thích vào đây nhé!</p>
          <Link to="/" className="fav-page__login-btn">Khám phá ngay</Link>
        </div>
      </div>
    );
  }

  // ── Hiển thị danh sách ──
  return (
    <div className="fav-page">
      <div className="fav-page__header">
        <FavoriteIcon className="fav-page__header-icon" />
        <h3 className="fav-page__title">
          Sản phẩm yêu thích
          <span className="fav-page__count">{favoriteBooks.length}</span>
        </h3>
      </div>

      <div className="fav-grid">
        {favoriteBooks.map((fb) => (
          <FavoriteBookCard key={fb.idBook} idBook={fb.idBook} idUser={idUser} />
        ))}
      </div>
    </div>
  );
}

export default AccountFavoritesPage;
