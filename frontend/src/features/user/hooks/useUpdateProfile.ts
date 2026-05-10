import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/userApi";

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: (_, variables) => {
            // Làm mới dữ liệu người dùng sau khi cập nhật thành công
            queryClient.invalidateQueries({ queryKey: ["user-basic", variables.idUser] });
        },
    });
}
