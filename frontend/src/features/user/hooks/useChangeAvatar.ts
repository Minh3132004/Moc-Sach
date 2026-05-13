import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeAvatar } from "../api/userApi";
import { useAuth } from "../../../app/providers/AuthProvider";

export function useChangeAvatar() {
    const queryClient = useQueryClient();
    const { login } = useAuth();

    return useMutation({
        mutationFn: ({ idUser, avatarUrl }: { idUser: number; avatarUrl: string }) => 
            changeAvatar(idUser, avatarUrl),
        onSuccess: (response, variables) => {
            // Cập nhật token mới (chứa avatar mới) vào AuthProvider
            if (response.data?.jwtToken) {
                login(response.data.jwtToken);
            }
            // Làm mới cache query thông tin cơ bản
            queryClient.invalidateQueries({ queryKey: ["user-basic", variables.idUser] });
        },
    });
}
