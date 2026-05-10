import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import AccountPasswordTab from "./accounttabs/AccountPasswordTab";
import AccountProfileTab from "./accounttabs/AccountProfileTab";

type AccountTab = "profile" | "password";

function AccountLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(true);
  const [activeAccountTab, setActiveAccountTab] = useState<AccountTab>("profile");

  const palette = {
    primary: "#2a8190",
    text: "#111827",
    muted: "#6b7280",
    border: "rgba(17, 24, 39, 0.08)",
    card: "#ffffff",
    page: "#f5f7fb",
  };

  const activeStyle = { color: palette.primary, fontWeight: 700, textDecoration: "none" };
  const normalStyle = { color: palette.text, textDecoration: "none" };

  const getLinkStyle = (path: string) => (location.pathname === path ? activeStyle : normalStyle);

  const isOnAccountPage = useMemo(() => location.pathname === "/account", [location.pathname]);

  useEffect(() => {
    if (!isOnAccountPage) {
      setActiveAccountTab("profile");
    }
  }, [isOnAccountPage]);

  const renderAccountTab = () => {
    switch (activeAccountTab) {
      case "profile":
        return <AccountProfileTab />;
      case "password":
        return <AccountPasswordTab />;
      default:
        return <AccountProfileTab />;
    }
  };

  return (
    <div style={{ padding: "28px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "flex", gap: "20px" }}>
        {/* Sidebar */}
        <aside style={{ width: 300, flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            <div style={{ background: palette.card, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 10px 30px rgba(17,24,39,0.06)", overflow: "hidden" }}>
              <div style={{ padding: "14px 14px 10px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountMenuOpen((v) => !v);
                  }}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    padding: "10px 10px",
                    cursor: "pointer",
                    textAlign: "left",
                    ...normalStyle,
                    ...getLinkStyle("/account"),
                    fontSize: "15px",
                    fontWeight: 700,
                    fontSynthesis: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    borderRadius: 10,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span style={{ flex: 1 }}>Thông tin tài khoản</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isAccountMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 150ms ease" }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {isAccountMenuOpen && (
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveAccountTab("profile");
                        navigate("/account");
                      }}
                      style={{
                        background: isOnAccountPage && activeAccountTab === "profile" ? "rgba(42,129,144,0.10)" : "transparent",
                        border: `1px solid ${isOnAccountPage && activeAccountTab === "profile" ? "rgba(42,129,144,0.25)" : "transparent"}`,
                        padding: "10px 10px",
                        cursor: "pointer",
                        textAlign: "left",
                        color: isOnAccountPage && activeAccountTab === "profile" ? palette.primary : palette.text,
                        fontWeight: isOnAccountPage && activeAccountTab === "profile" ? 700 : 600,
                        borderRadius: 10,
                      }}
                    >
                      Hồ sơ cá nhân
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveAccountTab("password");
                        navigate("/account");
                      }}
                      style={{
                        background: isOnAccountPage && activeAccountTab === "password" ? "rgba(42,129,144,0.10)" : "transparent",
                        border: `1px solid ${isOnAccountPage && activeAccountTab === "password" ? "rgba(42,129,144,0.25)" : "transparent"}`,
                        padding: "10px 10px",
                        cursor: "pointer",
                        textAlign: "left",
                        color: isOnAccountPage && activeAccountTab === "password" ? palette.primary : palette.text,
                        fontWeight: isOnAccountPage && activeAccountTab === "password" ? 700 : 600,
                        borderRadius: 10,
                      }}
                    >
                      Đổi mật khẩu
                    </button>
                  </div>
                )}
              </div>

              <div style={{ padding: "12px 14px 14px", borderTop: `1px solid ${palette.border}` }}>
                <div style={{ color: palette.muted, fontSize: 12, fontWeight: 700, letterSpacing: "0.02em", marginBottom: 10 }}>
                  Tiện ích
                </div>

                <Link
                  to="/order/history"
                  style={{
                    ...normalStyle,
                    ...getLinkStyle("/order/history"),
                    fontSize: "14px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 10px",
                    borderRadius: 10,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                  Đơn hàng của tôi
                </Link>

                <Link
                  to="/wishlist"
                  style={{
                    ...normalStyle,
                    ...getLinkStyle("/wishlist"),
                    fontSize: "14px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 10px",
                    borderRadius: 10,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  Sản phẩm yêu thích
                </Link>

                <Link
                  to="/voucher"
                  style={{
                    ...normalStyle,
                    ...getLinkStyle("/voucher"),
                    fontSize: "14px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 10px",
                    borderRadius: 10,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"></rect><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Mã giảm giá
                </Link>

              </div>
            </div>

          </div>
        </aside>

        {/* Main Content */}
        <section style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: palette.card, borderRadius: 14, border: `1px solid ${palette.border}`, boxShadow: "0 10px 30px rgba(17,24,39,0.06)", padding: 20 }}>
            {isOnAccountPage ? renderAccountTab() : <Outlet />}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AccountLayout;
