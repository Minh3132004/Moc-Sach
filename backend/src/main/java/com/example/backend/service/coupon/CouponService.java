package com.example.backend.service.coupon;

import com.example.backend.dto.request.coupon.CouponRequest;
import org.springframework.http.ResponseEntity;

public interface CouponService {
    ResponseEntity<?> validateCoupon(String code);

    ResponseEntity<?> createCoupon(int quantity, CouponRequest couponDTO);

    ResponseEntity<?> deleteCoupon(int id);

    ResponseEntity<?> updateActiveCoupon(int id, CouponRequest couponDTO);

    ResponseEntity<?> updateUsedCoupon(String code);

}