import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../api/userApi";

export function useChangePassword() {
    return useMutation({
        mutationFn: changePassword,
    });
}
