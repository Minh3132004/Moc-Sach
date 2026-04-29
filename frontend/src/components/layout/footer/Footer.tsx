import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="newsletter">
        <div className="newsletter-inner">
          <div className="newsletter-title">
            <span aria-hidden="true">✉</span>
            <span>ĐĂNG KÝ NHẬN BẢN TIN</span>
          </div>
          <div className="newsletter-form">
            <input
              className="newsletter-input"
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
            />
            <button className="newsletter-btn" type="button">
              Đăng ký
            </button>
          </div>
        </div>
      </div>

      <div className="footer-body">
        <div className="footer-body-inner">
          <div className="brand-block">
          <div className="brand-title">Mộc Sách</div>
          <p className="brand-text">
            Lầu 5, 387-389 Hai Bà Trưng Quận 3 TP HCM
          </p>
          <p className="brand-text">
            Công Ty Cổ Phần Phát Hành Sách TPHCM - FAHASA
          </p>
          <p className="brand-text">
            60-62 Lê Lợi, Quận 1, TP. HCM, Việt Nam
          </p>
          <p className="brand-text">
            Mộc Sách nhận đặt hàng trực tuyến và giao hàng tận nơi.
          </p>
          <p className="brand-text">
            Không hỗ trợ đặt mua và nhận hàng trực tiếp tại văn phòng.
          </p>

          <div className="social-row">
            <span className="social-pill">f</span>
            <span className="social-pill">in</span>
            <span className="social-pill">t</span>
            <span className="social-pill">yt</span>
            <span className="social-pill">ig</span>
            <span className="social-pill">p</span>
          </div>

          <div className="store-row">
            <span className="store-badge">Google Play</span>
            <span className="store-badge">App Store</span>
          </div>
          </div>

          <div className="footer-right">
            <div className="footer-links">
            <div>
              <h5>DỊCH VỤ</h5>
              <ul>
                <li>
                  <a href="#!">Điều khoản sử dụng</a>
                </li>
                <li>
                  <a href="#!">Chính sách bảo mật thông tin cá nhân</a>
                </li>
                <li>
                  <a href="#!">Chính sách bảo mật thanh toán</a>
                </li>
                <li>
                  <a href="#!">Giới thiệu Mộc Sách</a>
                </li>
                <li>
                  <a href="#!">Hệ thống nhà sách</a>
                </li>
              </ul>
            </div>
            <div>
              <h5>HỖ TRỢ</h5>
              <ul>
                <li>
                  <a href="#!">Chính sách đổi - trả - hoàn tiền</a>
                </li>
                <li>
                  <a href="#!">Chính sách bảo hành - bồi hoàn</a>
                </li>
                <li>
                  <a href="#!">Chính sách vận chuyển</a>
                </li>
                <li>
                  <a href="#!">Chính sách khách sỉ</a>
                </li>
              </ul>
            </div>
            <div>
              <h5>TÀI KHOẢN CỦA TÔI</h5>
              <ul>
                <li>
                  <Link to="/login">Đăng nhập/Tạo mới tài khoản</Link>
                </li>
                <li>
                  <a href="#!">Thay đổi địa chỉ khách hàng</a>
                </li>
                <li>
                  <a href="#!">Chi tiết tài khoản</a>
                </li>
                <li>
                  <a href="#!">Lịch sử mua hàng</a>
                </li>
              </ul>
            </div>
            </div>

            <div className="contact-row">
            <div>Địa chỉ: 60-62 Lê Lợi, Q.1, TP. HCM</div>
            <div>Email: cskh@mocsach.com</div>
            <div>Hotline: 1900 636 467</div>
            </div>

            <div className="partner-row">
            <div className="partner-pill">LEX</div>
            <div className="partner-pill">Viettel Post</div>
            <div className="partner-pill">GHN</div>
            <div className="partner-pill">VNPost</div>
            <div className="partner-pill">VNPAY QR</div>
            <div className="partner-pill">MoMo</div>
            <div className="partner-pill">ShopeePay</div>
            <div className="partner-pill">ZaloPay</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
