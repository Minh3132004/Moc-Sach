import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActivateAccount } from "../features/user/hooks/useActivateAccount";
import "./ActiveAccountPage.css";

function ActiveAccountPage() {
  const { email, activationCode } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useActivateAccount(email, activationCode);
  const [countdown, setCountdown] = useState<number>(5);

  const isInvalidLink = !email || !activationCode;
  
  // Xử lý status hiển thị
  const status = isLoading ? "loading" : isError || isInvalidLink ? "error" : "success";
  
  // Xử lý message hiển thị
  const message = isLoading ? "Đang kích hoạt tài khoản..." : 
                  isInvalidLink ? "Link kích hoạt không hợp lệ" :
                  isError ? (error instanceof Error ? error.message : "Kích hoạt tài khoản thất bại") : 
                  data?.message || "Kích hoạt tài khoản thành công";

  // Đồng hồ đếm ngược
  useEffect(() => {
    if (status !== "loading" && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status !== "loading" && countdown === 0) {
      navigate("/");
    }
  }, [status, countdown, navigate]);

  return (
    <div className="active-account-wrap">
      <div className="active-account-glass-card">
        <div className="active-account-content">
          <div className={`active-icon-container ${status}`}>
            {status === "loading" && <div className="active-spinner"></div>}
            {status === "success" && (
              <svg viewBox="0 0 24 24" width="32" height="32">
                <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {status === "error" && (
              <svg viewBox="0 0 24 24" width="32" height="32">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M12 16v-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="12" cy="8" r="1.5" fill="currentColor" />
              </svg>
            )}
          </div>

          <h2 className="active-title">
            {status === "loading" ? "Kích hoạt tài khoản" : "Thông báo hệ thống"}
          </h2>
          
          <p className="active-message">{message}</p>

          {status !== "loading" && (
            <div className="active-countdown-pill">
              Tự động chuyển trang sau <strong>{countdown}s</strong>
            </div>
          )}

          {!isLoading && (
            <button className="active-btn-primary" onClick={() => navigate("/")}>
              Về trang chủ ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActiveAccountPage;
