package com.example.backend.dto.request.user;

import java.util.Date;

import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserUpdateRequest {

    private String email;
    private String firstName;
    private String lastName;

    @Pattern(regexp = "^(0[0-9]{9})?$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;

    @Size(min = 8, max = 64, message = "Mật khẩu phải từ 8 đến 64 ký tự")
    private String password;

    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    private Date dateOfBirth;

    @Pattern(regexp = "^(?i)(M|F|K)?$", message = "Giới tính không hợp lệ")
    private String gender;

    private String deliveryAddress;
}
