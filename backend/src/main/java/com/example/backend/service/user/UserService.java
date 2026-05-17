package com.example.backend.service.user;
import com.example.backend.dto.request.user.ChangeAvatarRequest;
import com.example.backend.dto.request.user.ChangePasswordRequest;
import com.example.backend.dto.request.user.UpdateProfileRequest;
import com.example.backend.dto.request.user.AdminUserCreateRequest;
import com.example.backend.dto.request.user.AdminUserUpdateRequest;
import com.example.backend.dto.request.user.UserCreateRequest;
import com.example.backend.dto.request.auth.LoginRequest;

import org.springframework.http.ResponseEntity;

public interface UserService {
    public ResponseEntity<?> register(UserCreateRequest userDTO);
    public ResponseEntity<?> addUserByAdmin(AdminUserCreateRequest request);
    public ResponseEntity<?> updateUserByAdmin(int userId, AdminUserUpdateRequest request);
    public ResponseEntity<?> getUserById(int userId);
    public ResponseEntity<?> authenticate(LoginRequest loginRequest);
    public ResponseEntity<?> forgotPassword(String email);
    public ResponseEntity<?> updateProfile(UpdateProfileRequest updateProfileDTO);
    public ResponseEntity<?> changePassword(ChangePasswordRequest changePasswordDTO);
    public ResponseEntity<?> changeAvatar(ChangeAvatarRequest changeAvatarDTO);
    public ResponseEntity<?> getAllUsers(int page, int size, String keyword, String sort);
    public ResponseEntity<?> toggleUserStatus(int userId);

}
