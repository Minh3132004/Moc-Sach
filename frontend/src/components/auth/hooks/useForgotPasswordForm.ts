import { useState } from "react";

export function useForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const emailError = emailTouched && !email.trim() 
    ? "Vui lòng nhập email" 
    : emailTouched && !/\S+@\S+\.\S+/.test(email)
    ? "Email không đúng định dạng"
    : "";

  const canSubmit = email.trim() !== "" && !emailError;

  const markAllTouched = () => {
    setEmailTouched(true);
  };

  return {
    email,
    setEmail,
    emailError,
    canSubmit,
    markAllTouched,
    reset: () => {
      setEmail("");
      setEmailTouched(false);
    }
  };
}
