package com.example.backend.controller.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.user.ChangeAvatarRequest;
import com.example.backend.dto.request.user.ChangePasswordRequest;
import com.example.backend.dto.request.email.EmailRequest;
import com.example.backend.dto.request.user.UpdateProfileRequest;
import com.example.backend.dto.request.user.AdminUserCreateRequest;
import com.example.backend.dto.request.user.AdminUserUpdateRequest;
import com.example.backend.dto.request.user.UserCreateRequest;
import com.example.backend.dto.request.auth.LoginRequest;
import com.example.backend.service.user.UserServiceImp;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/user")
@Validated
public class UserController {
    @Autowired
    private UserServiceImp userServiceImp;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Validated @RequestBody UserCreateRequest userDTO) {
        return userServiceImp.register(userDTO);
    }

    @PostMapping("/add-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addUserByAdmin(@Validated @RequestBody AdminUserCreateRequest request) {
        return userServiceImp.addUserByAdmin(request);
    }

    @PatchMapping("/{id}/update-by-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserByAdmin(@PathVariable @Positive(message = "id phải lớn hơn 0") int id,
            @Validated @RequestBody AdminUserUpdateRequest request) {
        return userServiceImp.updateUserByAdmin(id, request);
    }

    @GetMapping("/get-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sort
    ) {
        return userServiceImp.getAllUsers(page, size, keyword, sort);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getUserById(@PathVariable @Positive(message = "id phải lớn hơn 0") int id) {
        return userServiceImp.getUserById(id);
    }

    @GetMapping("/active-account")
    public ResponseEntity<?> activeAccount(@RequestParam @NotBlank(message = "Email không được để trống") String email,
            @RequestParam @NotBlank(message = "Mã kích hoạt không được để trống") String activationCode) {
        return userServiceImp.activeAccount(email, activationCode);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@Valid @RequestBody LoginRequest loginRequest) {
        return userServiceImp.authenticate(loginRequest);
    }

    @PutMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody EmailRequest emailDTO) {
        return userServiceImp.forgotPassword(emailDTO.getEmail());
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequest updateProfileDTO) {
        return userServiceImp.updateProfile(updateProfileDTO);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest changePasswordDTO){
        return userServiceImp.changePassword(changePasswordDTO);
    }

    @PutMapping("/change-avatar")
    public ResponseEntity<?> changeAvatar(@Valid @RequestBody ChangeAvatarRequest changeAvatarDTO) {
        return userServiceImp.changeAvatar(changeAvatarDTO);
    }



    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable @Positive(message = "id phải lớn hơn 0") int id) {
        return userServiceImp.toggleUserStatus(id);
    }
}
