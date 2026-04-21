package com.example.backend.service.user;
import com.example.backend.dto.request.user.ChangeAvatarRequest;
import com.example.backend.dto.request.user.ChangePasswordRequest;
import com.example.backend.dto.request.user.UpdateProfileRequest;
import com.example.backend.entity.user.User;
import com.example.backend.dto.request.auth.LoginRequest;

import org.springframework.http.ResponseEntity;

public interface UserService {
    public ResponseEntity<?> register(User user);
    public ResponseEntity<?> addUserByAdmin(User user);
    public ResponseEntity<?> updateUserByAdmin(int userId, User updateData);
    public ResponseEntity<?> authenticate(LoginRequest loginRequest);
    public ResponseEntity<?> forgotPassword(String email);
    public ResponseEntity<?> updateProfile(UpdateProfileRequest updateProfileDTO);
    public ResponseEntity<?> changePassword(ChangePasswordRequest changePasswordDTO);
    public ResponseEntity<?> changeAvatar(ChangeAvatarRequest changeAvatarDTO);

}
