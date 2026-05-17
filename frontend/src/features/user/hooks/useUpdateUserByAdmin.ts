import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserByAdmin } from "../api/userApi";

export function useUpdateUserByAdmin(options?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateUserByAdmin(id, payload),
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
