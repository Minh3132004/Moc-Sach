import { Link } from "react-router-dom";
import "./Footer.css";

// MUI Social Icons
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TumblrIcon from "@mui/icons-material/Flip"; // fallback

// Import partner logos
import logoMomo from "../../../assets/logos/momo.png";
import logoZalopay from "../../../assets/logos/zalopay.png";
import logoVnpay from "../../../assets/logos/vnpay.png";
import logoGhn from "../../../assets/logos/ghn.png";
import logoVnpost from "../../../assets/logos/vnpost.png";
import logoShopee from "../../../assets/logos/shopee.png";
import logoLex from "../../../assets/logos/lex.jpg";
import logoViettelPost from "../../../assets/logos/viettelpost.png";

// Import store badges
import googlePlayBadge from "../../../assets/logos/google-play-badge.svg";
import appStoreBadge from "../../../assets/logos/app-store-badge.svg";

const partners = [
  { name: "LEX", logo: logoLex },
  { name: "Viettel Post", logo: logoViettelPost },
  { name: "GHN", logo: logoGhn },
  { name: "VNPost", logo: logoVnpost },
  { name: "VNPAY QR", logo: logoVnpay },
  { name: "MoMo", logo: logoMomo },
  { name: "ShopeePay", logo: logoShopee },
  { name: "ZaloPay", logo: logoZalopay },
];

const socialLinks = [
  { icon: <FacebookIcon />, label: "Facebook", href: "#!" },
  { icon: <InstagramIcon />, label: "Instagram", href: "#!" },
  { icon: <YouTubeIcon />, label: "YouTube", href: "#!" },
  { icon: <TumblrIcon />, label: "Tumblr", href: "#!" },
  { icon: <TwitterIcon />, label: "Twitter", href: "#!" },
  { icon: <PinterestIcon />, label: "Pinterest", href: "#!" },
];

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

            {/* Social Media Icons */}
            <div className="social-row">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="social-pill"
                  aria-label={s.label}
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Store Badges */}
            <div className="store-row">
              <a href="#!" className="store-badge-link" aria-label="Google Play">
                <img src={googlePlayBadge} alt="Google Play" className="store-badge-img" />
              </a>
              <a href="#!" className="store-badge-link" aria-label="App Store">
                <img src={appStoreBadge} alt="App Store" className="store-badge-img" />
              </a>
            </div>
          </div>

          <div className="footer-right">
            <div className="footer-links">
              <div>
                <h5>DỊCH VỤ</h5>
                <ul>
                  <li><a href="#!">Điều khoản sử dụng</a></li>
                  <li><a href="#!">Chính sách bảo mật thông tin cá nhân</a></li>
                  <li><a href="#!">Chính sách bảo mật thanh toán</a></li>
                  <li><a href="#!">Giới thiệu Mộc Sách</a></li>
                  <li><a href="#!">Hệ thống nhà sách</a></li>
                </ul>
              </div>
              <div>
                <h5>HỖ TRỢ</h5>
                <ul>
                  <li><a href="#!">Chính sách đổi - trả - hoàn tiền</a></li>
                  <li><a href="#!">Chính sách bảo hành - bồi hoàn</a></li>
                  <li><a href="#!">Chính sách vận chuyển</a></li>
                  <li><a href="#!">Chính sách khách sỉ</a></li>
                </ul>
              </div>
              <div>
                <h5>TÀI KHOẢN CỦA TÔI</h5>
                <ul>
                  <li><Link to="/login">Đăng nhập/Tạo mới tài khoản</Link></li>
                  <li><a href="#!">Thay đổi địa chỉ khách hàng</a></li>
                  <li><a href="#!">Chi tiết tài khoản</a></li>
                  <li><a href="#!">Lịch sử mua hàng</a></li>
                </ul>
              </div>
            </div>

            <div className="contact-row">
              <div>Địa chỉ: 60-62 Lê Lợi, Q.1, TP. HCM</div>
              <div>Email: cskh@mocsach.com</div>
              <div>Hotline: 1900 636 467</div>
            </div>

            <div className="partner-row">
              {partners.map((p) => (
                <div className="partner-pill" key={p.name} title={p.name}>
                  <img src={p.logo} alt={p.name} className="partner-logo" />
                  <span className="partner-name">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
