package com.example.backend.service.coupon;

import com.example.backend.dto.response.coupon.CouponResponse;
import org.springframework.http.ResponseEntity;

public interface CouponService {
    ResponseEntity<?> validateCoupon(String code);

    ResponseEntity<?> createCoupon(int quantity, CouponResponse couponDTO);

    ResponseEntity<?> deleteCoupon(int id);

    ResponseEntity<?> updateActiveCoupon(int id, CouponResponse couponDTO);

    ResponseEntity<?> updateUsedCoupon(String code);

}