import { useMemo, useState } from "react";

export default function useRegisterForm() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [touched, setTouched] = useState({
    lastName: false,
    firstName: false,
    username: false,
    phone: false,
    email: false,
    password: false,
    passwordConfirm: false,
  });

  const rawUsernameError = useMemo(() => {
    const value = username.trim();
    if (!value) return "Tên đăng nhập không được để trống";
    if (value.length < 3) return "Tên đăng nhập phải có ít nhất 3 ký tự";
    return "";
  }, [username]);

  const usernameError = useMemo(() => {
    if (!touched.username) return "";
    return rawUsernameError;
  }, [rawUsernameError, touched.username]);

  const rawPasswordLengthError = useMemo(() => {
    if (!password) return "Mật khẩu không được để trống";
    if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    return "";
  }, [password]);

  const passwordLengthError = useMemo(() => {
    if (!touched.password) return "";
    return rawPasswordLengthError;
  }, [rawPasswordLengthError, touched.password]);

  const rawEmailError = useMemo(() => {
    const value = email.trim();
    if (!value) return "Email không được để trống";
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!isValid) return "Email không hợp lệ";
    return "";
  }, [email]);

  const emailError = useMemo(() => {
    if (!touched.email) return "";
    return rawEmailError;
  }, [rawEmailError, touched.email]);

  const rawFirstNameError = useMemo(() => {
    if (!firstName.trim()) return "Tên không được để trống";
    return "";
  }, [firstName]);

  const firstNameError = useMemo(() => {
    if (!touched.firstName) return "";
    return rawFirstNameError;
  }, [rawFirstNameError, touched.firstName]);

  const rawLastNameError = useMemo(() => {
    if (!lastName.trim()) return "Họ không được để trống";
    return "";
  }, [lastName]);

  const lastNameError = useMemo(() => {
    if (!touched.lastName) return "";
    return rawLastNameError;
  }, [rawLastNameError, touched.lastName]);

  const rawPhoneError = useMemo(() => {
    const value = phone.trim();
    if (!value) return "Số điện thoại không được để trống";
    // Regex cho số điện thoại Việt Nam (bắt đầu bằng 0 hoặc +84, theo sau là 9 chữ số)
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(value)) return "Số điện thoại không hợp lệ (VD: 0912345678)";
    return "";
  }, [phone]);

  const phoneError = useMemo(() => {
    if (!touched.phone) return "";
    return rawPhoneError;
  }, [rawPhoneError, touched.phone]);

  const passwordError = useMemo(() => {
    if (!touched.passwordConfirm) return "";
    if (!passwordConfirm) return "";
    if (passwordConfirm !== password) return "Mật khẩu xác nhận không khớp";
    return "";
  }, [password, passwordConfirm, touched.passwordConfirm]);

  const canSubmit = useMemo(() => {
    return (
      !rawUsernameError &&
      !rawPasswordLengthError &&
      !rawEmailError &&
      !rawFirstNameError &&
      !rawLastNameError &&
      !rawPhoneError &&
      Boolean(passwordConfirm) &&
      passwordConfirm === password
    );
  }, [
    rawUsernameError,
    rawPasswordLengthError,
    rawEmailError,
    rawFirstNameError,
    rawLastNameError,
    rawPhoneError,
    passwordConfirm,
    password,
  ]);

  return {
    lastName,
    setLastName: (value: string) => {
      setLastName(value);
      setTouched((prev) => ({ ...prev, lastName: true }));
    },
    lastNameError,
    firstName,
    setFirstName: (value: string) => {
      setFirstName(value);
      setTouched((prev) => ({ ...prev, firstName: true }));
    },
    firstNameError,
    username,
    setUsername: (value: string) => {
      setUsername(value);
      setTouched((prev) => ({ ...prev, username: true }));
    },
    usernameError,
    phone,
    setPhone: (value: string) => {
      setPhone(value);
      setTouched((prev) => ({ ...prev, phone: true }));
    },
    phoneError,
    email,
    setEmail: (value: string) => {
      setEmail(value);
      setTouched((prev) => ({ ...prev, email: true }));
    },
    emailError,
    password,
    setPassword: (value: string) => {
      setPassword(value);
      setTouched((prev) => ({ ...prev, password: true }));
    },
    passwordLengthError,
    passwordConfirm,
    setPasswordConfirm: (value: string) => {
      setPasswordConfirm(value);
      setTouched((prev) => ({ ...prev, passwordConfirm: true }));
    },
    passwordError,
    markAllTouched: () => {
      setTouched({
        lastName: true,
        firstName: true,
        username: true,
        phone: true,
        email: true,
        password: true,
        passwordConfirm: true,
      });
    },
    canSubmit,
  };
}
