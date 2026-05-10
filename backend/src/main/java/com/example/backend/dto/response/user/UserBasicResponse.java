package com.example.backend.dto.response.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserBasicResponse {
    private int idUser;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String phoneNumber;
    private Character gender;
    private Date dateOfBirth;
    private String deliveryAddress;
    private String avatar;
    private boolean enabled;
}
