import "./AuthModal.css";
import { useEffect, useId, useState } from "react";
import type { AuthModalProps, AuthTab } from "./types";
import { LoginForm, RegisterForm } from "./components";
import { useLoginForm, useRegisterForm } from "./hooks";
import { useRegisterUser } from "../../features/user/hooks/useRegisterUser";
function AuthModal({ open, initialTab, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<AuthTab>(initialTab);
  const [registerMessage, setRegisterMessage] = useState<string>("");

  const loginForm = useLoginForm();
  const registerForm = useRegisterForm();

  const registerMutation = useRegisterUser();
  const [registerStatus, setRegisterStatus] = useState<"idle" | "success" | "error">("idle");

  const idBase = useId();

  useEffect(() => {
    if (open) {
      setTab(initialTab);
      setRegisterMessage("");
    }
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmitRegister = async () => {
    registerForm.markAllTouched();
    if (!registerForm.canSubmit) return;

    setRegisterMessage("");
    setRegisterStatus("idle");
    try {
      const payload = {
        username: registerForm.username,
        password: registerForm.password,
        email: registerForm.email,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        phoneNumber: registerForm.phone,
      };

      const result: any = await registerMutation.mutateAsync(payload);

      const message = result?.message || "Đăng ký thành công! Vui lòng kiểm tra email.";

      setRegisterMessage(message);
      setRegisterStatus("success");
      // Delay switching to login so user can read the success message
      setTimeout(() => {
        setTab("login");
        loginForm.setUsername(registerForm.phone || registerForm.email || registerForm.username);
        loginForm.setPassword("");
      }, 3000);
    } catch (e: any) {
      setRegisterMessage(e?.message || "Đăng ký thất bại. Vui lòng thử lại.");
      setRegisterStatus("error");
    }
  };

  return (
    <div className="auth-modal-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${idBase}-title`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="auth-modal-tabs" role="tablist" aria-label="Chọn biểu mẫu">
          <button
            type="button"
            className={tab === "login" ? "auth-tab active" : "auth-tab"}
            role="tab"
            aria-selected={tab === "login"}
            onClick={() => {
              setTab("login");
              setRegisterMessage("");
              setRegisterStatus("idle");
            }}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className={tab === "register" ? "auth-tab active" : "auth-tab"}
            role="tab"
            aria-selected={tab === "register"}
            onClick={() => setTab("register")}
          >
            Đăng ký
          </button>
        </div>

        {registerMessage && (
          <div className={`auth-global-message ${registerStatus}`}>
            {registerStatus === "success" ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span>{registerMessage}</span>
          </div>
        )}

        {tab === "login" ? (
          <LoginForm
            username={loginForm.username}
            password={loginForm.password}
            onChangeUsername={loginForm.setUsername}
            onChangePassword={loginForm.setPassword}
            onSubmit={() => {}}
            onSkip={onClose}
          />
        ) : (
          <RegisterForm
            lastName={registerForm.lastName}
            lastNameError={registerForm.lastNameError}
            firstName={registerForm.firstName}
            firstNameError={registerForm.firstNameError}
            username={registerForm.username}
            usernameError={registerForm.usernameError}
            phone={registerForm.phone}
            phoneError={registerForm.phoneError}
            email={registerForm.email}
            emailError={registerForm.emailError}
            password={registerForm.password}
            passwordLengthError={registerForm.passwordLengthError}
            passwordConfirm={registerForm.passwordConfirm}
            passwordError={registerForm.passwordError}
            onChangeLastName={registerForm.setLastName}
            onChangeFirstName={registerForm.setFirstName}
            onChangeUsername={registerForm.setUsername}
            onChangePhone={registerForm.setPhone}
            onChangeEmail={registerForm.setEmail}
            onChangePassword={registerForm.setPassword}
            onChangePasswordConfirm={registerForm.setPasswordConfirm}
            onSubmit={handleSubmitRegister}
            onSkip={onClose}
          />
        )}
      </div>
    </div>
  );
}

export default AuthModal;
