import "./Navbar.css";
import TopBanner from "./TopBanner";

function Navbar() {
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
            <div className="nav-item">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4"></circle>
                <path d="M4 21c2-4 14-4 16 0"></path>
              </svg>
              <span>Tài khoản</span>
            </div>
            <div className="flag-chip" aria-label="Quốc gia">
              <span className="flag">★</span>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Navbar;
