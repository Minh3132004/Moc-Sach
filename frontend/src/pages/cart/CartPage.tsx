import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { toast } from "react-toastify";

import { useCartItemsByUserId, useRemoveCartItem, useUpdateCartItemQuantity } from "../../features/cart/hooks";
import { useAuth } from "../../app/providers/AuthProvider";
import LoginPrompt from "../../components/auth/LoginPrompt";
import "./CartPage.css";

const PLACEHOLDER_IMG = "https://via.placeholder.com/100x140?text=No+Image";

function imageUrl(img: any): string {
  if (!img || !img.urlImage) return PLACEHOLDER_IMG;
  return img.urlImage;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const idUser = user?.id;
  const { data: cartItems, isLoading, isError, error, refetch } = useCartItemsByUserId(idUser);
  const updateQuantityMutation = useUpdateCartItemQuantity();
  const removeItemMutation = useRemoveCartItem();

  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Tự động chọn tất cả và khởi tạo số lượng khi load xong giỏ hàng
  useEffect(() => {
    if (cartItems) {
      const selected = cartItems
        .map(item => item.idCart)
        .filter((id): id is number => typeof id === "number");
      setSelectedItems(selected);

      const initialQuantities: Record<number, number> = {};
      cartItems.forEach(item => {
        if (typeof item.idCart === "number") {
          initialQuantities[item.idCart] = typeof item.quantity === "number" ? item.quantity : 1;
        }
      });
      setQuantities(initialQuantities);
    }
  }, [cartItems]);

  // Thay đổi số lượng
  const handleQuantityChange = async (idCart: number, delta: number, maxQty: number) => {
    const item = cartItems?.find(i => i.idCart === idCart);
    if (!item || !item.book || !idUser) return;

    const current = quantities[idCart] || item.quantity || 1;
    const newQty = Math.max(1, Math.min(maxQty, current + delta));

    // Optimistic UI update (cập nhật giao diện ngay lập tức)
    setQuantities((prev) => ({ ...prev, [idCart]: newQty }));

    try {
      await updateQuantityMutation.mutateAsync({
        idCart,
        quantity: newQty,
        idBook: item.book.idBook,
        idUser,
      });
    } catch (mutationError: any) {
      toast.error(mutationError?.message || "Không thể cập nhật số lượng.");
      // Rollback nếu bị lỗi
      setQuantities((prev) => ({ ...prev, [idCart]: current }));
    }
  };

  const handleRemoveItem = async (idCart: number) => {
    if (!idUser) return;

    try {
      await removeItemMutation.mutateAsync({ idCart, idUser });
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (mutationError: any) {
      toast.error(mutationError?.message || "Không thể xóa sản phẩm");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(cartItems?.map(item => item.idCart!) || []);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (idCart: number, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, idCart]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== idCart));
    }
  };

  const calculateTotal = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((total, item) => {
      if (selectedItems.includes(item.idCart!)) {
        const qty = quantities[item.idCart!] || item.quantity || 1;
        const price = item.book?.sellPrice || 0;
        return total + price * qty;
      }
      return total;
    }, 0);
  };

  if (!idUser) {
    return (
      <div className="cart-page">
        <div className="container">
          <LoginPrompt
            title="Vui lòng đăng nhập để xem giỏ hàng"
            message="Bạn cần đăng nhập để thêm sản phẩm và tiến hành thanh toán."
            icon={<ShoppingCartIcon style={{ fontSize: 56 }} />}
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="cart-page">
        <div className="container cart-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <CircularProgress style={{ color: '#2a8190' }} />
          <p>Đang tải giỏ hàng của bạn...</p>
        </div>
      </div>
    );
  }

  if (isError || !cartItems) {
    const loadErrorMessage = (error as any)?.message || "Không thể tải giỏ hàng. Vui lòng thử lại sau.";

    return (
      <div className="cart-page">
        <div className="container cart-error" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <ErrorOutlineIcon style={{ fontSize: '60px', color: '#e74c3c' }} />
          <h2>Đã xảy ra lỗi</h2>
          <p>{loadErrorMessage}</p>
          <button onClick={() => refetch()} className="cart-continue-btn" style={{ marginTop: '10px' }}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container cart-empty">
          <ShoppingCartIcon className="cart-empty-icon" />
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Hãy tìm thêm những cuốn sách hay và thêm vào giỏ hàng nhé!</p>
          <Link to="/books" className="cart-continue-btn">
            <ArrowBackIcon fontSize="small" />
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  const isAllSelected = selectedItems.length === cartItems.length && cartItems.length > 0;
  const totalPrice = calculateTotal();

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">GIỎ HÀNG ({cartItems.length} sản phẩm)</h1>
        <div className="cart-content">

          {/* Cột trái: Danh sách sản phẩm */}
          <div className="cart-items-container">
            {/* Header giỏ hàng */}
            <div className="cart-items-header">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Chọn tất cả ({cartItems.length} sản phẩm)</span>
              </label>
              <div className="header-qty">Số lượng</div>
              <div className="header-total">Thành tiền</div>
              <div></div>
            </div>

            {/* Danh sách item */}
            <div className="cart-items">
              {cartItems.map((item) => {
                const book = item.book;
                const image = item.images?.[0];
                const maxQty = book?.quantity || 0;
                const currentQty = quantities[item.idCart!] || item.quantity || 1;
                const sellPrice = book?.sellPrice || 0;
                const originalPrice = book?.listPrice || 0;
                const itemTotal = sellPrice * currentQty;
                const isSelected = selectedItems.includes(item.idCart!);

                return (
                  <div key={item.idCart} className="cart-item">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectItem(item.idCart!, e.target.checked)}
                      />
                      <span className="checkmark"></span>
                    </label>

                    <div className="cart-item-image">
                      <img src={imageUrl(image)} alt={book?.nameBook || "Sách"} />
                    </div>

                    <div className="cart-item-info">
                      <Link to={`/books/${book?.idBook}`} className="cart-item-name">
                        {book?.nameBook}
                      </Link>
                      <div className="cart-item-price-wrapper">
                        <span className="cart-item-price">
                          {sellPrice.toLocaleString("vi-VN")} đ
                        </span>
                        {originalPrice > sellPrice && (
                          <span className="cart-item-original-price">
                            {originalPrice.toLocaleString("vi-VN")} đ
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="cart-item-quantity">
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.idCart!, -1, maxQty)}
                        disabled={currentQty <= 1}
                      >
                        <RemoveIcon fontSize="small" />
                      </button>
                      <span className="qty-value">{currentQty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.idCart!, 1, maxQty)}
                        disabled={currentQty >= maxQty}
                      >
                        <AddIcon fontSize="small" />
                      </button>
                    </div>

                    <div className="cart-item-total">
                      {itemTotal.toLocaleString("vi-VN")} đ
                    </div>

                    <button
                      className="cart-item-remove"
                      onClick={() => handleRemoveItem(item.idCart!)}
                      title="Xóa sản phẩm"
                    >
                      <DeleteOutlineIcon />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cột phải: Khuyến mãi & Tổng kết */}
          <div className="cart-sidebar">

            {/* Block Khuyến mãi */}
            <div className="cart-sidebar-block promo-block">
              <div className="promo-header">
                <div className="promo-title">
                  <ConfirmationNumberOutlinedIcon style={{ color: '#2a8190' }} />
                  <span>KHUYẾN MÃI</span>
                </div>
                <button className="promo-view-more">Xem thêm &gt;</button>
              </div>
              <div className="promo-ticket">
                <div className="promo-ticket-info">
                  <strong>Mã Giảm 10K - Toàn Sàn</strong>
                  <p>Đơn hàng từ 150K - Không bao gồm giá trị của các sản phẩm ngoại lệ...</p>
                  <div className="promo-ticket-progress">
                    <div className="progress-bar"><div className="progress-fill" style={{ width: '60%' }}></div></div>
                    <span className="progress-text">Mua thêm 61.500 đ</span>
                  </div>
                </div>
                <button className="promo-ticket-btn">Mua thêm</button>
              </div>
              <div className="promo-hint">Hướng dẫn sử dụng Gift Card <ErrorOutlineIcon fontSize="small" style={{ marginLeft: 4 }} /></div>
            </div>

            {/* Block Nhận quà */}
            <div className="cart-sidebar-block gift-block">
              <div className="gift-title">
                <CardGiftcardOutlinedIcon style={{ color: '#e74c3c' }} />
                <span>Nhận quà</span>
              </div>
              <button className="promo-view-more">Chọn quà &gt;</button>
            </div>

            {/* Block Miễn phí giao hàng */}
            <div className="cart-sidebar-block shipping-block">
              <LocalShippingOutlinedIcon style={{ color: '#2a8190' }} />
              <span><strong>Miễn phí giao hàng</strong> cho đơn hàng từ <strong>360k</strong> trở lên!</span>
            </div>

            {/* Block Tổng tiền */}
            <div className="cart-sidebar-block summary-block">
              <div className="summary-row">
                <span>Thành tiền</span>
                <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="summary-row summary-final">
                <span><strong>Tổng Số Tiền (gồm VAT)</strong></span>
                <span className="summary-final-total">{totalPrice.toLocaleString("vi-VN")} đ</span>
              </div>

              <button
                className="checkout-btn"
                onClick={() => navigate('/checkout')}
                disabled={selectedItems.length === 0}
              >
                THANH TOÁN
              </button>
              <div className="checkout-hint">(Giảm giá trên web chỉ áp dụng cho bán lẻ)</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default CartPage;
