import type { FormEvent } from "react";

type RegisterFormProps = {
  lastName: string;
  lastNameError: string;
  firstName: string;
  firstNameError: string;
  username: string;
  usernameError: string;
  phone: string;
  phoneError: string;
  email: string;
  emailError: string;
  password: string;
  passwordLengthError: string;
  passwordConfirm: string;
  passwordError: string;
  onChangeLastName: (value: string) => void;
  onChangeFirstName: (value: string) => void;
  onChangeUsername: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangePasswordConfirm: (value: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
};

function RegisterForm({
  lastName,
  lastNameError,
  firstName,
  firstNameError,
  username,
  usernameError,
  phone,
  phoneError,
  email,
  emailError,
  password,
  passwordLengthError,
  passwordConfirm,
  passwordError,
  onChangeLastName,
  onChangeFirstName,
  onChangeUsername,
  onChangePhone,
  onChangeEmail,
  onChangePassword,
  onChangePasswordConfirm,
  onSubmit,
  onSkip,
}: RegisterFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-grid">
        <label className="auth-field">
          <span className="auth-label">Họ đệm *</span>
          <input
            className={`auth-input ${lastNameError ? "error" : ""}`}
            value={lastName}
            onChange={(e) => onChangeLastName(e.target.value)}
          />
          {lastNameError && <div className="auth-error">{lastNameError}</div>}
        </label>

        <label className="auth-field">
          <span className="auth-label">Tên *</span>
          <input
            className={`auth-input ${firstNameError ? "error" : ""}`}
            value={firstName}
            onChange={(e) => onChangeFirstName(e.target.value)}
          />
          {firstNameError && <div className="auth-error">{firstNameError}</div>}
        </label>

        <label className="auth-field">
          <span className="auth-label">Tên đăng nhập *</span>
          <input
            className={`auth-input ${usernameError ? "error" : ""}`}
            value={username}
            onChange={(e) => onChangeUsername(e.target.value)}
            autoComplete="username"
          />
          {usernameError && <div className="auth-error">{usernameError}</div>}
        </label>

        <label className="auth-field">
          <span className="auth-label">Số điện thoại *</span>
          <input
            className={`auth-input ${phoneError ? "error" : ""}`}
            type="tel"
            value={phone}
            onChange={(e) => {
              // Chỉ cho phép nhập số và dấu +
              const val = e.target.value.replace(/[^0-9+]/g, "");
              onChangePhone(val);
            }}
            placeholder="Ví dụ: 0912345678"
          />
          {phoneError && <div className="auth-error">{phoneError}</div>}
        </label>

        <label className="auth-field">
          <span className="auth-label">Mật khẩu *</span>
          <input
            className={`auth-input ${passwordLengthError ? "error" : ""}`}
            type="password"
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            autoComplete="new-password"
          />
          {passwordLengthError && <div className="auth-error">{passwordLengthError}</div>}
        </label>

        <label className="auth-field">
          <span className="auth-label">Xác nhận mật khẩu *</span>
          <input
            className={`auth-input ${passwordError ? "error" : ""}`}
            type="password"
            value={passwordConfirm}
            onChange={(e) => onChangePasswordConfirm(e.target.value)}
            autoComplete="new-password"
          />
          {passwordError && <div className="auth-error">{passwordError}</div>}
        </label>

        <label className="auth-field full">
          <span className="auth-label">Email *</span>
          <input
            className={`auth-input ${emailError ? "error" : ""}`}
            type="text"
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
            autoComplete="email"
          />
          {emailError && <div className="auth-error">{emailError}</div>}
        </label>
      </div>

      <div className="auth-terms">
        Bằng việc đăng ký, bạn đã đồng ý với MocSach.com về{" "}
        <a
          className="auth-link"
          href="#"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Điều khoản dịch vụ
        </a>
        {" "}&{" "}
        <a
          className="auth-link"
          href="#"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Chính sách bảo mật MocSach
        </a>
        .
      </div>

      <div className="auth-action-group">
        <button
          className="auth-submit primary"
          type="submit"
          disabled={Boolean(passwordError) || Boolean(passwordLengthError) || Boolean(usernameError) || Boolean(emailError)}
        >
          Tạo tài khoản
        </button>
        <button className="auth-submit outline" type="button" onClick={onSkip}>
          Bỏ qua
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;
