/*
 * Shape chuẩn của backend ApiResponse<T>:
 *   { error: 0, message: "...", data: T }    → thành công
 *   { error: -1, message: "...", data: null } → thất bại
 */
export interface ApiResponse<T = null> {
  error: number;   // 0 = success, -1 hoặc code khác = error
  message: string;
  data: T | null;
}

/** Helper: kiểm tra response có phải success không */
export function isApiSuccess<T>(res: ApiResponse<T>): boolean {
  return res.error === 0;
}
