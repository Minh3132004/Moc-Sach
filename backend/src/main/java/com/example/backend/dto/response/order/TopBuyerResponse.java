package com.example.backend.dto.response.order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopBuyerResponse {
    private int idUser;
    private String firstName;
    private String lastName;
    private String username;
    private String phoneNumber;
    private String avatar;
    private double totalOrderValue;
}
