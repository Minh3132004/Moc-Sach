import { useQuery } from "@tanstack/react-query";
import { activateAccount } from "../api/userApi";

export function useActivateAccount(email?: string, activationCode?: string) {
  return useQuery({
    queryKey: ["activate-account", email, activationCode],
    queryFn: () => activateAccount(email!, activationCode!),
    enabled: !!email && !!activationCode, // Chỉ chạy khi có đủ email và code
    retry: false, // Kích hoạt thì không thử lại (retry) nếu lỗi
    refetchOnWindowFocus: false, // Tránh gửi lại request khi người dùng chuyển tab
  });
}
