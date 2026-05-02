package com.example.backend.service.user;

import com.example.backend.dao.user.RoleRepository;
import com.example.backend.dao.user.UserRepository;
import com.example.backend.dto.request.user.ChangeAvatarRequest;
import com.example.backend.dto.request.user.UserCreateRequest;
import com.example.backend.dto.request.user.ChangePasswordRequest;
import com.example.backend.dto.request.user.UpdateProfileRequest;
import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.InternalServerException;
import com.example.backend.exception.NotFoundException;
import com.example.backend.entity.user.Role;
import com.example.backend.entity.user.User;
import com.example.backend.dto.response.auth.JwtResponse;
import com.example.backend.dto.request.auth.LoginRequest;
import com.example.backend.service.jwt.JwtService;
import com.example.backend.service.uploadImage.UploadImageService;
import com.example.backend.service.email.EmailService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.*;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

@Service
public class UserServiceImp implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UploadImageService uploadImageService;

    public ResponseEntity<?> register(UserCreateRequest userDTO) {
        try {
            // Kiểm tra username đã tồn tại chưa
            if (userRepository.existsByUsername(userDTO.getUsername())) {
                throw new ConflictException("Username đã tồn tại.");
            }

            // Kiểm tra email
            if (userRepository.existsByEmail(userDTO.getEmail())) {
                throw new ConflictException("Email đã tồn tại.");
            }

            User user = new User();
            user.setUsername(userDTO.getUsername());
            user.setEmail(userDTO.getEmail());
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            user.setPhoneNumber(userDTO.getPhoneNumber());

            // Mã hoá mật khẩu
            String encodePassword = passwordEncoder.encode(userDTO.getPassword());
            user.setPassword(encodePassword);

            // Set ảnh đại diện
            user.setAvatar("");

            // Tạo mã kích hoạt
            user.setActivationCode(generateActivationCode());
            user.setEnabled(false);

            // Cho role mặc định là CUSTOMER
            List<Role> roleList = new ArrayList<>();
            Role customerRole = roleRepository.findByNameRole("CUSTOMER");
            if (customerRole == null) {
                throw new NotFoundException("Không tìm thấy quyền CUSTOMER");
            }
            roleList.add(customerRole);
            user.setListRoles(roleList);

            // Lưu user vào database
            userRepository.save(user);
            // Gửi email cho người dùng để kích hoạt
            sendEmailActivation(user.getEmail(), user.getActivationCode());

            return ResponseEntity.ok(ApiResponse.success("Đăng ký thành công , vui lòng kiểm tra email để kích hoạt tài khoản !", null));
        } catch (ConflictException | NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Đăng ký tài khoản thất bại", e);
        }
    }

    // 👇 Thêm user bởi Admin
    public ResponseEntity<?> addUserByAdmin(UserCreateRequest userDTO) {
        try {
            // Kiểm tra username đã tồn tại chưa
            if (userRepository.existsByUsername(userDTO.getUsername())) {
                throw new ConflictException("Username đã tồn tại.");
            }

            // Kiểm tra email
            if (userRepository.existsByEmail(userDTO.getEmail())) {
                throw new ConflictException("Email đã tồn tại.");
            }

            User user = new User();
            user.setUsername(userDTO.getUsername());
            user.setEmail(userDTO.getEmail());
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            user.setPhoneNumber(userDTO.getPhoneNumber());

            // Mã hoá mật khẩu
            String encodePassword = passwordEncoder.encode(userDTO.getPassword());
            user.setPassword(encodePassword);

            // Set ảnh đại diện
            user.setAvatar("");

            // Tạo mã kích hoạt
            user.setActivationCode(generateActivationCode());
            user.setEnabled(false);

            // Cho role mặc định là CUSTOMER
            List<Role> roleList = new ArrayList<>();
            Role customerRole = roleRepository.findByNameRole("CUSTOMER");
            if (customerRole == null) {
                throw new NotFoundException("Không tìm thấy quyền CUSTOMER");
            }
            roleList.add(customerRole);
            user.setListRoles(roleList);

            // Lưu user vào database
            userRepository.save(user);

            // Gửi email xác nhận
            sendEmailActivation(user.getEmail(), user.getActivationCode());

            return ResponseEntity.ok(ApiResponse.success("Người dùng được tạo thành công! Email xác nhận đã được gửi.", null));
        } catch (ConflictException | NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Thêm người dùng thất bại", e);
        }
    }

    // 👇 Cập nhật user bởi Admin
    public ResponseEntity<?> updateUserByAdmin(int userId, User updateData) {
        try {
            // Tìm user theo ID
            User existingUser = userRepository.findById(userId)
                    .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại."));

            // Cập nhật các field
            if (updateData.getEmail() != null && !updateData.getEmail().isEmpty()) {
                // Kiểm tra email không bị trùng (ngoại trừ user hiện tại)
                if (!existingUser.getEmail().equals(updateData.getEmail()) &&
                        userRepository.existsByEmail(updateData.getEmail())) {
                    throw new ConflictException("Email đã tồn tại.");
                }
                existingUser.setEmail(updateData.getEmail());
            }

            if (updateData.getFirstName() != null && !updateData.getFirstName().isEmpty()) {
                existingUser.setFirstName(updateData.getFirstName());
            }

            if (updateData.getLastName() != null && !updateData.getLastName().isEmpty()) {
                existingUser.setLastName(updateData.getLastName());
            }

            if (updateData.getPhoneNumber() != null) {
                existingUser.setPhoneNumber(updateData.getPhoneNumber());
            }

            if (updateData.getDateOfBirth() != null) {
                existingUser.setDateOfBirth(updateData.getDateOfBirth());
            }

            if (updateData.getGender() != '\0') {
                existingUser.setGender(updateData.getGender());
            }

            if (updateData.getDeliveryAddress() != null) {
                existingUser.setDeliveryAddress(updateData.getDeliveryAddress());
            }

            // Cập nhật password nếu có
            if (updateData.getPassword() != null && !updateData.getPassword().isEmpty()) {
                String encodePassword = passwordEncoder.encode(updateData.getPassword());
                existingUser.setPassword(encodePassword);
            }

            // Lưu user đã cập nhật
            userRepository.save(existingUser);

            return ResponseEntity.ok(ApiResponse.success("Cập nhật người dùng thành công.", null));
        } catch (ConflictException | NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Cập nhật người dùng thất bại", e);
        }
    }

    private String generateActivationCode() {
        return UUID.randomUUID().toString();
    }

    //Gửi email kích hoạt tài khoản
    private void sendEmailActivation(String email, String activationCode) {
        String endpointFE = "http://localhost:5173";
        String url = endpointFE + "/active/" + email + "/" + activationCode;
        String subject = "Kích hoạt tài khoản";
        String message = "Cảm ơn bạn đã là thành viên của chúng tôi. Vui lòng kích hoạt tài khoản!: <br/> Mã kích hoạt: <strong>"+ activationCode +"<strong/>";
        message += "<br/> Click vào đây để <a href="+ url +">kích hoạt</a>";
        emailService.sendMessage("de180352vubinhminh@gmail.com", email, subject, message);
    }


    // Kích hoạt tài khoản
    public ResponseEntity<?> activeAccount(String email, String activationCode) {
        try {
            // Tìm kiếm user theo email
            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new NotFoundException("Người dùng không tồn tại!");
            }
            if (user.isEnabled()) {
                throw new ConflictException("Tài khoản đã được kích hoạt");
            }
            // Kiểm tra mã kích hoạt
            if (user.getActivationCode().equals(activationCode)) {
                // Set trạng thái kích hoạt là true
                user.setEnabled(true);
                userRepository.save(user);
            } else {
                throw new BadRequestException("Mã kích hoạt không chính xác!");
            }
            return ResponseEntity.ok(ApiResponse.success("Kích hoạt thành công", null));
        } catch (ConflictException | NotFoundException | BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Kích hoạt tài khoản thất bại", e);
        }
    }

    //Chức năng đăng nhập cho người dùng 
    public ResponseEntity<?> authenticate(LoginRequest loginRequest) {
        try {
            Authentication authentication;
            try {
                authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
            } catch (AuthenticationException e) {
                throw new BadRequestException("Tên đăng nhập hoặc mật khẩu không đúng!");
            }

            if (!authentication.isAuthenticated()) {
                throw new BadRequestException("Xác thực không thành công");
            }

            User user = userRepository.findByUsername(loginRequest.getUsername());
            if (user == null) {
                throw new NotFoundException("Người dùng không tồn tại!");
            }
            if (!user.isEnabled()) {
                throw new BadRequestException("Tài khoản đã bị khóa hoặc chưa được kích hoạt!");
            }

            final String jwtToken = jwtService.generateToken(loginRequest.getUsername());
            return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", new JwtResponse(jwtToken)));
        } catch (NotFoundException | BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Xác thực người dùng thất bại", e);
        }
    }


    //Quên mật khẩu 
    public ResponseEntity<?> forgotPassword(String email) {
        try {
            //Tìm kiếm người dùng theo email
            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new NotFoundException("Không tìm thấy người dùng");
            }

            // Đổi mật khẩu cho user (dùng mật khẩu random)
            String passwordTemp = generateTemporaryPassword();
            user.setPassword(passwordEncoder.encode(passwordTemp));
            userRepository.save(user);

            // Gửi email để nhận mật khẩu
            sendEmailForgotPassword(user.getEmail(), passwordTemp);

            return ResponseEntity.ok(ApiResponse.success("Đã gửi mật khẩu tạm thời qua email", null));
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Lấy mật khẩu tạm thời thất bại", e);
        }
    }

    //Gửi email quên mật khẩu 
    private void sendEmailForgotPassword(String email, String password) {
        String subject = "Reset mật khẩu";
        String message = "Mật khẩu tạm thời của bạn là: <strong>" + password + "</strong>";
        message += "<br/> <span>Vui lòng đăng nhập và đổi lại mật khẩu của bạn</span>";
        emailService.sendMessage("de180352vubinhminh@gmail.com", email, subject, message);
    }

    
    private String generateTemporaryPassword() {
        return RandomStringUtils.random(10, true, true); //(số lượng , từ , số)
    }

    // Cập nhật thông tin cá nhân
    public ResponseEntity<?> updateProfile(UpdateProfileRequest updateProfileDTO) {
        try {
            // Tìm user theo id
            User user = userRepository.findById(updateProfileDTO.getIdUser())
                    .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại!"));

            // Cập nhật thông tin
            if (updateProfileDTO.getFirstName() != null && !updateProfileDTO.getFirstName().trim().isEmpty()) {
                user.setFirstName(updateProfileDTO.getFirstName().trim());
            }

            if (updateProfileDTO.getLastName() != null && !updateProfileDTO.getLastName().trim().isEmpty()) {
                user.setLastName(updateProfileDTO.getLastName().trim());
            }

            if (updateProfileDTO.getPhoneNumber() != null && !updateProfileDTO.getPhoneNumber().trim().isEmpty()) {
                user.setPhoneNumber(updateProfileDTO.getPhoneNumber().trim());
            }

            if (updateProfileDTO.getDeliveryAddress() != null) {
                user.setDeliveryAddress(updateProfileDTO.getDeliveryAddress().trim());
            }
            if (updateProfileDTO.getDateOfBirth() != null) {
                user.setDateOfBirth(new java.sql.Date(updateProfileDTO.getDateOfBirth().getTime()));
            }
            if (updateProfileDTO.getGender() != null && !updateProfileDTO.getGender().trim().isEmpty()) {
                user.setGender(Character.toUpperCase(updateProfileDTO.getGender().trim().charAt(0)));
            }

            // Lưu thay đổi vào database
            userRepository.save(user);

            return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin thành công", null));
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Cập nhật thông tin cá nhân thất bại", e);
        }
    }

    // Đổi mật khẩu
    public ResponseEntity<?> changePassword(ChangePasswordRequest changePasswordDTO) {
        try {
            // Tìm user theo id
            User user = userRepository.findById(changePasswordDTO.getIdUser())
                    .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại!"));

            // Kiểm tra mật khẩu hiện tại
            if (!passwordEncoder.matches(changePasswordDTO.getCurrentPassword(), user.getPassword())) {
                throw new BadRequestException("Mật khẩu hiện tại không đúng!");
            }

            // Kiểm tra mật khẩu mới và xác nhận mật khẩu
            if (!changePasswordDTO.getNewPassword().equals(changePasswordDTO.getConfirmPassword())) {
                throw new BadRequestException("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            }

            // Kiểm tra mật khẩu mới không được trùng với mật khẩu cũ
            if (passwordEncoder.matches(changePasswordDTO.getNewPassword(), user.getPassword())) {
                throw new BadRequestException("Mật khẩu mới phải khác mật khẩu hiện tại!");
            }

            // Mã hóa mật khẩu mới
            String encodedNewPassword = passwordEncoder.encode(changePasswordDTO.getNewPassword());
            user.setPassword(encodedNewPassword);

            // Lưu thay đổi vào database
            userRepository.save(user);

            return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công!", null));
        } catch (NotFoundException | BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Đổi mật khẩu thất bại", e);
        }
    }

    // Đổi avatar
    @Override
    @Transactional
    public ResponseEntity<?> changeAvatar(ChangeAvatarRequest changeAvatarDTO) {
        try {
            // Tìm user theo id
            User user = userRepository.findById(changeAvatarDTO.getIdUser())
                    .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại!"));

            // Xóa ảnh cũ trong Cloudinary nếu có
            if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
                try {
                    uploadImageService.deleteImage(user.getAvatar());
                } catch (RuntimeException ignored) {
                    // Tiếp tục cập nhật ảnh mới dù không xóa được ảnh cũ
                }
            }

            user.setAvatar(changeAvatarDTO.getAvatarUrl());
            userRepository.save(user);

            // Tạo token mới và trả về
            final String jwtToken = jwtService.generateToken(user.getUsername());
            return ResponseEntity.ok(ApiResponse.success("Đổi avatar thành công", new JwtResponse(jwtToken)));
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Đổi ảnh đại diện thất bại", e);
        }
    }
}
