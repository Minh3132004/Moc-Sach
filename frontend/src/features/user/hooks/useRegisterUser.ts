import { registerUser } from "../api/userApi";

import { useMutation } from "@tanstack/react-query";

export function useRegisterUser() {
  return useMutation({
    mutationFn: (payload: any) => registerUser(payload),
    retry: 0,
  });
}
