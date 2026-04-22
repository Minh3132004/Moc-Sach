package com.example.backend.service.coupon;

import com.example.backend.dao.coupon.CouponRepository;
import com.example.backend.dto.request.coupon.CouponRequest;
import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.entity.coupon.Coupon;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.NotFoundException;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;

@Service
public class CouponServiceImp implements CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Override
    public ResponseEntity<?> validateCoupon(String code) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new NotFoundException("Mã giảm giá không tồn tại"));

        LocalDate today = LocalDate.now();
        if (coupon.getExpiryDate().before(Date.valueOf(today))) {
            throw new BadRequestException("Mã giảm giá đã hết hạn");
        }

        return ResponseEntity.ok(ApiResponse.success("Mã giảm giá hợp lệ", null));
    }

    @Override
    public ResponseEntity<?> createCoupon(int quantity, CouponRequest couponDTO) {
        for (int i = 0; i < quantity; i++) {
            Coupon coupon = new Coupon();
            coupon.setCode(generateCodeCoupon());
            coupon.setDiscountPercent(couponDTO.getDiscountPercent());
            coupon.setExpiryDate(couponDTO.getExpiryDate());
            coupon.setActive(true);
            couponRepository.save(coupon);
        }
        return ResponseEntity.ok(ApiResponse.success("Tạo mã giảm giá thành công", null));
    }

    @Override
    public ResponseEntity<?> deleteCoupon(int id) {
        if (!couponRepository.existsById(id)) {
            throw new NotFoundException("Mã giảm giá không tồn tại");
        }
        couponRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa mã giảm giá thành công", null));
    }

    @Override
    public ResponseEntity<?> updateActiveCoupon(int id, CouponRequest couponDTO) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Mã giảm giá không tồn tại"));
        coupon.setActive(couponDTO.isActive());
        couponRepository.save(coupon);

        return ResponseEntity.ok(ApiResponse.success("Cập nhật mã giảm giá thành công", null));
    }

    @Override
    public ResponseEntity<?> updateUsedCoupon(String code) {
        couponRepository.findByCode(code)
                .orElseThrow(() -> new NotFoundException("Mã giảm giá không tồn tại"));
        return ResponseEntity.ok(ApiResponse.success("Áp dụng mã giảm giá thành công", null));
    }

    private String generateCodeCoupon() {
        return RandomStringUtils.random(12, true, true); // (số lượng , từ , số)
    }

}