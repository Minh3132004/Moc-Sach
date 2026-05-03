import { useMemo, useState } from "react";

export default function useLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = useMemo(() => {
    return Boolean(username.trim()) && Boolean(password);
  }, [username, password]);

  return {
    username,
    setUsername,
    password,
    setPassword,
    canSubmit,
  };
}
