package com.example.backend.service.coupon;

import com.example.backend.dao.coupon.CouponRepository;
import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.dto.response.coupon.CouponResponse;
import com.example.backend.entity.coupon.Coupon;
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
        try {
            // Tìm coupon theo code
            if (couponRepository.findByCode(code).isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Mã giảm giá không tồn tại"));
            }

            Coupon coupon = couponRepository.findByCode(code).get();

            // Kiểm tra mã còn hạn không
            LocalDate today = LocalDate.now();
            if (coupon.getExpiryDate().before(Date.valueOf(today))) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Mã giảm giá đã hết hạn"));
            }

            return ResponseEntity.ok(ApiResponse.success("Mã giảm giá hợp lệ", null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error("Xảy ra lỗi khi kiểm tra mã giảm giá"));
        }
    }

    @Override
    public ResponseEntity<?> createCoupon(int quantity, CouponResponse couponDTO) {
        try {
            for (int i = 0; i < quantity; i++) {
                // Tạo coupon mới
                Coupon coupon = new Coupon();
                coupon.setCode(generateCodeCoupon());
                coupon.setDiscountPercent(couponDTO.getDiscountPercent());
                coupon.setExpiryDate(couponDTO.getExpiryDate());
                coupon.setActive(true);

                couponRepository.save(coupon);
            }
            return ResponseEntity.ok(ApiResponse.success("Tạo mã giảm giá thành công", null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error("Xảy ra lỗi khi tạo mã giảm giá"));
        }
    }

    @Override
    public ResponseEntity<?> deleteCoupon(int id) {
        try {
            couponRepository.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa mã giảm giá thành công", null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error("Xảy ra lỗi khi xóa mã giảm giá"));
        }
    }

    @Override
    public ResponseEntity<?> updateActiveCoupon(int id, CouponResponse couponDTO) {
        try {
            Coupon coupon = couponRepository.findById(id).get();
            coupon.setActive(couponDTO.isActive());
            couponRepository.save(coupon);

            return ResponseEntity.ok(ApiResponse.success("Cập nhật mã giảm giá thành công", null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error("Xảy ra lỗi khi cập nhật mã giảm giá"));
        }
    }

    @Override
    public ResponseEntity<?> updateUsedCoupon(String code) {
        try {
            Coupon coupon = couponRepository.findByCode(code).get();
            if (coupon == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Mã giảm giá không tồn tại"));
            }

            return ResponseEntity.ok(ApiResponse.success("Áp dụng mã giảm giá thành công", null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error("Xảy ra lỗi khi áp dụng mã giảm giá"));
        }
    }

    private String generateCodeCoupon() {
        return RandomStringUtils.random(12, true, true); // (số lượng , từ , số)
    }

}