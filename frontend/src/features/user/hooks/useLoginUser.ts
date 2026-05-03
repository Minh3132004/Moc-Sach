import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/userApi";

export function useLoginUser() {
    return useMutation({
        mutationFn: loginUser,
    });
}
