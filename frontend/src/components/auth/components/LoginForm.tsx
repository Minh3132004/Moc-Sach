import { useState, type FormEvent } from "react";

type LoginFormProps = {
  username: string;
  usernameError?: string;
  password: string;
  passwordError?: string;
  onChangeUsername: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
};

function LoginForm({
  username,
  usernameError,
  password,
  passwordError,
  onChangeUsername,
  onChangePassword,
  onSubmit,
  onSkip,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="auth-field">
        <span className="auth-label">Tên đăng nhập</span>
        <input
          className={`auth-input ${usernameError ? "error" : ""}`}
          value={username}
          onChange={(e) => onChangeUsername(e.target.value)}
          autoComplete="username"
        />
        {usernameError && <div className="auth-error">{usernameError}</div>}
      </label>

      <label className="auth-field">
        <span className="auth-label">Mật khẩu</span>
        <div className="auth-input-wrapper">
          <input
            className={`auth-input ${passwordError ? "error" : ""}`}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            autoComplete="current-password"
          />
          <button 
            type="button" 
            className="auth-input-toggle"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>
        {passwordError && <div className="auth-error">{passwordError}</div>}
      </label>

      <div className="auth-form-footer">
        <a
          className="auth-link"
          href="#"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Quên mật khẩu?
        </a>
      </div>

      <div className="auth-action-group">
        <button className="auth-submit primary" type="submit">
          Đăng nhập
        </button>
        <button className="auth-submit outline" type="button" onClick={onSkip}>
          Bỏ qua
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
