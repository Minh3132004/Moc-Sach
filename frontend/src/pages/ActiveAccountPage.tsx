import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../lib/http";
import "./ActiveAccountPage.css";

function ActiveAccountPage() {
  const { email, activationCode } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState<string>("Đang kích hoạt tài khoản...");
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!email || !activationCode) {
        setLoading(false);
        setStatus("error");
        setMessage("Link kích hoạt không hợp lệ");
        return;
      }

      try {
        const result: any = await api.get(
          `/user/active-account?email=${encodeURIComponent(email)}&activationCode=${encodeURIComponent(
            activationCode
          )}`
        );

        if (cancelled) return;

        setStatus("success");
        setMessage(result?.message || "Kích hoạt tài khoản thành công");
      } catch (e: any) {
        if (cancelled) return;
        setStatus("error");
        setMessage(e?.message || "Kích hoạt tài khoản thất bại");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [email, activationCode]);

  return (
    <div className="active-account-wrap">
      <div className="active-account-card">
        <div className="active-account-header">
          <h2 className="active-account-title">Kích hoạt tài khoản</h2>
        </div>

        <div className="active-account-body">
          <div className="active-account-status">
            <div className={`active-account-icon ${status}`} aria-hidden="true">
              {status === "success" ? (
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path
                    d="M20 6L9 17l-5-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : status === "error" ? (
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path
                    d="M12 2a10 10 0 1 0 10 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            <div className="active-account-message">{message}</div>
          </div>

          {!loading && (
            <div className="active-account-actions">
              <button className="active-account-btn primary" type="button" onClick={() => navigate("/")}> 
                Về trang chủ
              </button>
              <button className="active-account-btn outline" type="button" onClick={() => navigate("/")}> 
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActiveAccountPage;
