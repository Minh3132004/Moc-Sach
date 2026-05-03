import "./Navbar.css";
import TopBanner from "./TopBanner";
import { useEffect, useRef, useState } from "react";
import { AuthModal } from "../../auth";
import { useAuth } from "../../../app/providers/AuthProvider";

function Navbar() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const closeAccountMenuTimeoutRef = useRef<number | null>(null);

  const { user, logout } = useAuth();

  const openAccountMenu = () => {
    if (closeAccountMenuTimeoutRef.current !== null) {
      window.clearTimeout(closeAccountMenuTimeoutRef.current);
      closeAccountMenuTimeoutRef.current = null;
    }
    setShowAccountMenu(true);
  };

  const scheduleCloseAccountMenu = () => {
    if (closeAccountMenuTimeoutRef.current !== null) {
      window.clearTimeout(closeAccountMenuTimeoutRef.current);
    }

    closeAccountMenuTimeoutRef.current = window.setTimeout(() => {
      setShowAccountMenu(false);
      closeAccountMenuTimeoutRef.current = null;
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (closeAccountMenuTimeoutRef.current !== null) {
        window.clearTimeout(closeAccountMenuTimeoutRef.current);
      }
    };
  }, []);

  const openAuthModal = (tab: "login" | "register") => {
    setAuthModalTab(tab);
    setShowAuthModal(true);
    setShowAccountMenu(false);
  };

  return (
    <>
      <TopBanner />
      <header className="main-header">
        <div className="nav-row">
          <div className="brand">Mộc Sách</div>

          <button className="menu-btn" type="button" aria-label="Danh mục">
            <span className="menu-dot"></span>
            <span className="menu-dot"></span>
            <span className="menu-dot"></span>
            <span className="menu-dot"></span>
          </button>

          <div className="search-wrap">
            <input
              className="search-input"
              type="text"
              placeholder="Tìm kiếm sách..."
            />
            <button className="search-btn" type="button" aria-label="Tìm kiếm">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7"></circle>
                <path d="M20 20l-4.2-4.2"></path>
              </svg>
            </button>
          </div>

          <nav className="nav-actions">
            <div className="nav-item">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7"></path>
                <path d="M10 19a2 2 0 0 0 4 0"></path>
              </svg>
              <span>Thông báo</span>
            </div>
            <div className="nav-item">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"></path>
              </svg>
              <span>Giỏ hàng</span>
            </div>
            <div
              className="nav-item account-item"
              onMouseEnter={openAccountMenu}
              onMouseLeave={scheduleCloseAccountMenu}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4"></circle>
                <path d="M4 21c2-4 14-4 16 0"></path>
              </svg>
              <span>{user ? user.lastName || "Tài khoản" : "Tài khoản"}</span>
              {showAccountMenu && (
                <div className="account-dropdown">
                  {user ? (
                    <>
                      <button className="account-dropdown-btn" type="button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        Tài khoản của tôi
                      </button>
                      <button className="account-dropdown-btn" type="button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        Đơn hàng của tôi
                      </button>
                      <button className="account-dropdown-btn" type="button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        Sản phẩm yêu thích
                      </button>
                      <button className="account-dropdown-btn" type="button" onClick={logout}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Thoát tài khoản
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="account-dropdown-btn" type="button" onClick={() => openAuthModal("login")}>
                        Đăng nhập
                      </button>
                      <button className="account-dropdown-btn" type="button" onClick={() => openAuthModal("register")}>
                        Đăng ký
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            <button className="language-switch" type="button" aria-label="Chọn ngôn ngữ">
              <span className="language-flag" aria-hidden="true">★</span>
              <span className="language-label">VI</span>
              <svg className="language-caret" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <AuthModal
        open={showAuthModal}
        initialTab={authModalTab}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}

export default Navbar;
