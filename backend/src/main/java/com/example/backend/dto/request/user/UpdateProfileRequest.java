package com.example.backend.dto.request.user;

import java.util.Date;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @NotNull(message = "idUser không được để trống")
    @Positive(message = "idUser phải lớn hơn 0")
    private Integer idUser;

    @Size(max = 50, message = "Tên không được vượt quá 50 ký tự")
    private String firstName;

    @Size(max = 50, message = "Họ không được vượt quá 50 ký tự")
    private String lastName;

    @Pattern(regexp = "^(0[0-9]{9})?$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;

    @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự")
    private String deliveryAddress;

    @Pattern(regexp = "^(?i)(male|female|m|f)?$", message = "Giới tính chỉ chấp nhận male, female, m hoặc f")
    private String gender;

    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    private Date dateOfBirth;
}

