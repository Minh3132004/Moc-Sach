package com.example.backend.dto.request.user;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    private int idUser;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String deliveryAddress;
    private String gender;
    private Date dateOfBirth;
}

