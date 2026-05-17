import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";

const RequireAdmin = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithAdminCheck: React.FC<P> = (props) => {
    const navigate = useNavigate();
    const { user, isLoading, isAuthenticated } = useAuth();

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          // Trở về trang chủ và mở form đăng nhập
          navigate("/");
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("openAuthModal", { detail: { tab: "login" } }));
          }, 100);
        } else if (user?.role !== "ADMIN") {
          // Nếu có trang error-403 thì chuyển, nếu không thì cứ đẩy về trang chủ tạm thời
          navigate("/");
        }
      }
    }, [isLoading, isAuthenticated, user, navigate]);

    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (!isAuthenticated || user?.role !== "ADMIN") {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAdminCheck;
};

export default RequireAdmin;
