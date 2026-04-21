package com.example.backend.entity.coupon;

import com.example.backend.entity.order.Order;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Date;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "coupon")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_coupon")
    private int idCoupon;
    
    @Column(name = "code", unique = true, nullable = false)
    private String code;
    
    @Column(name = "discount_percent", nullable = false)
    private int discountPercent; // Giảm giá bao nhiêu %
    
    @Column(name = "expiry_date", nullable = false)
    private Date expiryDate; // Ngày hết hạn

    @Column(name = "is_active", nullable = false)
    @JsonProperty("isActive")
    private boolean isActive; // Kích hoạt

    @JsonIgnore
    @OneToMany(mappedBy = "coupon")
    private List<Order> listOrders; // 1 mã giảm giá có thể áp dụng cho nhiều đơn hàng
}