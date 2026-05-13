import React from "react";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { toast } from "react-toastify";

import { useAuth } from "../../../../app/providers/AuthProvider";
import { useFavoriteBooksByUser } from "../../../../features/favorite/hooks/useFavoriteBooksByUser";
import { useRemoveFavoriteBook } from "../../../../features/favorite/hooks/useRemoveFavoriteBook";
import { useBookById } from "../../../../features/book/hooks/useBookById";
import { useImagesByBook } from "../../../../features/image/hooks";
import LoginPrompt from "../../../../components/auth/LoginPrompt";
import "./AccountFavoritesPage.css";
import { useAddCartItem } from "../../../../features/cart/hooks";

const PLACEHOLDER_IMG = "https://via.placeholder.com/160x220?text=No+Image";

// ─── Card từng cuốn sách yêu thích ─────────────────────────────────────────
interface FavoriteBookCardProps {
  idBook: number;
  idUser: number;
}

const FavoriteBookCard: React.FC<FavoriteBookCardProps> = ({ idBook, idUser }) => {
  const { data: book, isError: bookError, error: bookErrorObj } = useBookById(idBook);
  const { data: images } = useImagesByBook(idBook);
  const { mutate: removeFavorite, isPending } = useRemoveFavoriteBook();

  const firstImage = images && images.length > 0 ? images[0] : undefined;
  const imageUrl = firstImage?.urlImage || PLACEHOLDER_IMG;

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

  const addMutation = useAddCartItem();

  /**
   * Thực hiện thêm sản phẩm vào giỏ hàng khi người dùng nhấn nút.
   */
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    addMutation.mutate(
      { idUser, idBook: book!.idBook, quantity: 1 },
      {
        onError: (err: any) => toast.error(err?.message || "Không thể thêm vào giỏ hàng"),
      }
    );
  };
  

  if (bookError) {
    return (
      <div className="fav-card" style={{ padding: 16, border: "1px solid rgba(17, 24, 39, 0.08)", borderRadius: 14 }}>
        <p style={{ margin: 0, color: "#b91c1c", fontWeight: 600, fontSize: 13 }}>
          {bookErrorObj instanceof Error ? bookErrorObj.message : "Không thể tải thông tin sách."}
        </p>
      </div>
    );
  }

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

        {/* Nút thêm vào giỏ hàng */}
        <button
          className={`fav-card__buy-btn${isSoldOut ? " fav-card__buy-btn--disabled" : ""}`}
          disabled={isSoldOut || addMutation.isPending}
          onClick={handleAddToCart}
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

  const { data: favoriteBooks, isLoading, isError, error } = useFavoriteBooksByUser(idUser);

  // ── Chưa đăng nhập ──
  if (!idUser) {
    return (
      <LoginPrompt 
        title="Vui lòng đăng nhập"
        message="Bạn cần đăng nhập để xem danh sách sách yêu thích của mình."
        icon={<FavoriteIcon style={{ fontSize: 64 }} />}
      />
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

  if (isError) {
    return (
      <div className="fav-page">
        <div className="fav-page__header">
          <FavoriteIcon className="fav-page__header-icon" />
          <h3 className="fav-page__title">Sản phẩm yêu thích</h3>
        </div>
        <div className="fav-page__empty">
          <FavoriteIcon className="fav-page__empty-icon" />
          <h3>Không thể tải danh sách yêu thích</h3>
          <p>{error instanceof Error ? error.message : "Vui lòng thử lại sau."}</p>
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
