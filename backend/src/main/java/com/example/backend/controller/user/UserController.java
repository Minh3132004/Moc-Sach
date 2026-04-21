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
import com.example.backend.dto.response.email.EmailResponse;
import com.example.backend.dto.request.user.UpdateProfileRequest;
import com.example.backend.entity.user.User;
import com.example.backend.dto.request.auth.LoginRequest;
import com.example.backend.service.user.UserServiceImp;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserServiceImp userServiceImp;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Validated @RequestBody User user) {
        return userServiceImp.register(user);
    }

    @PostMapping("/add-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addUserByAdmin(@Validated @RequestBody User user) {
        return userServiceImp.addUserByAdmin(user);
    }

    @PatchMapping("/{id}/update-by-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserByAdmin(@PathVariable int id, @RequestBody User user) {
        return userServiceImp.updateUserByAdmin(id, user);
    }

    @GetMapping("/active-account")
    public ResponseEntity<?> activeAccount(@RequestParam String email, @RequestParam String activationCode) {
        return userServiceImp.activeAccount(email, activationCode);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate (@RequestBody LoginRequest loginRequest) {
        return userServiceImp.authenticate(loginRequest);
    }

    @PutMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody EmailResponse emailDTO){
        return userServiceImp.forgotPassword(emailDTO.getEmail());
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@Validated @RequestBody UpdateProfileRequest updateProfileDTO){
        return userServiceImp.updateProfile(updateProfileDTO);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@Validated @RequestBody ChangePasswordRequest changePasswordDTO){
        return userServiceImp.changePassword(changePasswordDTO);
    }

    @PutMapping("/change-avatar")
    public ResponseEntity<?> changeAvatar(@Validated @RequestBody ChangeAvatarRequest changeAvatarDTO){
        return userServiceImp.changeAvatar(changeAvatarDTO);
    }
}
