import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../../features/user/api/userApi";

// Định nghĩa các thông tin và hàm mà AuthContext sẽ cung cấp ra ngoài
interface AuthContextType {
  user: JwtPayload | null;       // Thông tin user sau khi giải mã từ token
  isAuthenticated: boolean;      // Cờ báo hiệu user đã đăng nhập hay chưa
  isLoading: boolean;            // Cờ báo hiệu đang load kiểm tra token (dùng khi mới vào web)
  login: (token: string) => void;// Hàm gọi khi đăng nhập thành công
  logout: () => void;            // Hàm gọi khi muốn đăng xuất
}

// Khởi tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider - Lớp áo bọc ngoài cùng (được đặt trong main.tsx) để truyền dữ liệu đi khắp app
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Chạy MỘT LẦN DUY NHẤT khi người dùng vừa mới vào trang web
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Nếu có token trong máy, thử giải mã nó ra
        const decoded = jwtDecode<JwtPayload>(token);
        setUser(decoded); // Set thông tin user vào state
      } catch (e) {
        // Nếu token bị lỗi (ví dụ token giả mạo, token hỏng), thì xoá đi cho sạch
        console.error("Lỗi giải mã token:", e);
        localStorage.removeItem("token");
      }
    }
    // Chạy xong quá trình kiểm tra thì báo isLoading = false
    setIsLoading(false);
  }, []);

  // Hàm xử lý đăng nhập: Lưu token vào máy và cập nhật lại state user ngay lập tức
  const login = (token: string) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setUser(decoded);
    } catch (e) {
      console.error("Lỗi giải mã token:", e);
    }
  };

  // Hàm xử lý đăng xuất: Xóa token và tải lại trang để dọn dẹp sạch sẽ dữ liệu
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.reload(); 
  };

  // Biến tiện ích kiểm tra xem user có tồn tại không (!! biến object thành true/false)
  const isAuthenticated = !!user;

  // Cung cấp các biến và hàm này xuống cho tất cả các Component con (children)
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook tuỳ chỉnh (Custom Hook) để sử dụng AuthContext một cách ngắn gọn: 
// Thay vì dùng useContext(AuthContext), ta chỉ cần gọi useAuth()
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
}
