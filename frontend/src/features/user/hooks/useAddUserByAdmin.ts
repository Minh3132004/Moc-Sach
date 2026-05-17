import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserByAdmin } from "../api/userApi";

type AddUserByAdminPayload = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export function useAddUserByAdmin(options?: any) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, AddUserByAdminPayload>({
    mutationFn: addUserByAdmin,
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
