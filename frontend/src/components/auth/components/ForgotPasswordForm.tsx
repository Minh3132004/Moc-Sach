import type { FormEvent } from "react";

type ForgotPasswordFormProps = {
  email: string;
  emailError?: string;
  loading?: boolean;
  onChangeEmail: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function ForgotPasswordForm({
  email,
  emailError,
  loading,
  onChangeEmail,
  onSubmit,
  onBack,
}: ForgotPasswordFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-form-description">
        Nhập email của bạn để nhận mật khẩu mới.
      </div>

      <label className="auth-field">
        <span className="auth-label">Email</span>
        <input
          className={`auth-input ${emailError ? "error" : ""}`}
          type="email"
          value={email}
          onChange={(e) => onChangeEmail(e.target.value)}
          placeholder="example@gmail.com"
          autoFocus
        />
        {emailError && <div className="auth-error">{emailError}</div>}
      </label>

      <div className="auth-action-group">
        <button
          className="auth-submit primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
        <button
          className="auth-submit outline"
          type="button"
          onClick={onBack}
          disabled={loading}
        >
          Quay lại đăng nhập
        </button>
      </div>
    </form>
  );
}
