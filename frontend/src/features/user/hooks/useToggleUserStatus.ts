import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleUserStatus } from "../api/userApi";

export function useToggleUserStatus(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idUser: number) => toggleUserStatus(idUser),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options
  });
}
