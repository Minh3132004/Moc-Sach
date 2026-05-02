import type { FormEvent } from "react";

type LoginFormProps = {
  username: string;
  password: string;
  onChangeUsername: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
};

function LoginForm({
  username,
  password,
  onChangeUsername,
  onChangePassword,
  onSubmit,
  onSkip,
}: LoginFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="auth-field">
        <span className="auth-label">Số điện thoại/Email</span>
        <input
          className="auth-input"
          value={username}
          onChange={(e) => onChangeUsername(e.target.value)}
          autoComplete="username"
        />
      </label>

      <label className="auth-field">
        <span className="auth-label">Mật khẩu</span>
        <div className="auth-input-wrapper">
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            autoComplete="current-password"
          />
          <button type="button" className="auth-input-toggle">
            Hiện
          </button>
        </div>
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
