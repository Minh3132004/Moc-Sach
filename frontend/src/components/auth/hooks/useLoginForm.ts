import { useMemo, useState } from "react";

export default function useLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);

  const usernameError = useMemo(() => {
    if (!touched) return "";
    return username.trim() ? "" : "Vui lòng nhập tên đăng nhập";
  }, [username, touched]);

  const passwordError = useMemo(() => {
    if (!touched) return "";
    return password ? "" : "Vui lòng nhập mật khẩu";
  }, [password, touched]);

  const canSubmit = useMemo(() => {
    return Boolean(username.trim()) && Boolean(password);
  }, [username, password]);

  const markAllTouched = () => {
    setTouched(true);
  };

  return {
    username,
    setUsername,
    usernameError,
    password,
    setPassword,
    passwordError,
    canSubmit,
    markAllTouched,
  };
}
