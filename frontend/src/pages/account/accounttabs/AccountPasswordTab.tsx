import { useState } from "react";
import { useAuth } from "../../../app/providers/AuthProvider";
import { useChangePassword } from "../../../features/user/hooks/useChangePassword";
import { toast } from "react-toastify";

function AccountPasswordTab() {
  const { user, logout } = useAuth();
  const changePasswordMutation = useChangePassword();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    // Reset errors
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let hasError = false;

    // Kiểm tra rỗng
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
      hasError = true;
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
      hasError = true;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
      hasError = true;
    }

    // Kiểm tra logic khác nếu không rỗng
    if (!hasError) {
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        hasError = true;
      }

      if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        idUser: user.id,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      toast.success("Đổi mật khẩu thành công!");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (error: any) {
      toast.error(error.message || "Đổi mật khẩu thất bại!");
    }
  };

  return (
    <div style={{ maxWidth: 500 }}>
      <div style={{ marginBottom: 30 }}>
        <h2 style={{ margin: "0 0 8px 0", fontSize: 24, fontWeight: 800, color: "#111827" }}>
          Đổi mật khẩu
        </h2>
        <p style={{ margin: 0, color: "#6b7280", fontSize: 15 }}>
          Cập nhật mật khẩu để bảo mật tài khoản của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <PasswordField
          label="Mật khẩu hiện tại"
          name="currentPassword"
          value={formData.currentPassword}
          error={errors.currentPassword}
          showPassword={showCurrentPassword}
          onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
          onChange={handleInputChange}
          placeholder="Nhập mật khẩu hiện tại"
        />

        <PasswordField
          label="Mật khẩu mới"
          name="newPassword"
          value={formData.newPassword}
          error={errors.newPassword}
          showPassword={showNewPassword}
          onToggleShow={() => setShowNewPassword(!showNewPassword)}
          onChange={handleInputChange}
          placeholder="Tối thiểu 8 ký tự"
        />

        <PasswordField
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          value={formData.confirmPassword}
          error={errors.confirmPassword}
          showPassword={showConfirmPassword}
          onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
          onChange={handleInputChange}
          placeholder="Nhập lại mật khẩu mới"
        />

        <div style={{ marginTop: 10 }}>
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            style={{
              padding: "12px 24px",
              borderRadius: 8,
              border: "none",
              background: "#2a8190",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: changePasswordMutation.isPending ? "not-allowed" : "pointer",
              opacity: changePasswordMutation.isPending ? 0.7 : 1,
              transition: "all 0.2s",
              width: "fit-content"
            }}
          >
            {changePasswordMutation.isPending ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </button>
        </div>
      </form>
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  showPassword: boolean;
  onToggleShow: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function PasswordField({ label, name, value, error, showPassword, onToggleShow, onChange, placeholder }: PasswordFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: "#4b5563", textTransform: "uppercase" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "10px 44px 10px 12px",
            borderRadius: 8,
            border: `1px solid ${error ? "#ef4444" : "#d1d5db"}`,
            fontSize: 15,
            color: "#1f2937",
            outline: "none",
            background: "#f9fafb",
            boxSizing: "border-box",
            colorScheme: "light",
            transition: "border-color 0.2s"
          }}
        />
        <button
          type="button"
          onClick={onToggleShow}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "#6b7280",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            outline: "none",
            transition: "color 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          )}
        </button>
      </div>
      {error && (
        <div style={{ color: "#ef4444", fontSize: 13, fontWeight: 500, marginTop: 2 }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default AccountPasswordTab;

