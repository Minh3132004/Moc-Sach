package com.example.backend.controller.coupon;

import com.example.backend.dto.request.coupon.CouponRequest;
import com.example.backend.service.coupon.CouponService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/coupon")
@Validated
public class CouponController {
    @Autowired
    private CouponService couponService;

    // Kiểm tra mã giảm giá
    @GetMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestParam @NotBlank(message = "Mã giảm giá không được để trống") String code) {
        return couponService.validateCoupon(code);
    }

    // Tạo mã giảm giá (admin)
    @PostMapping("/create/{quantity}")
    public ResponseEntity<?> createCoupon(@PathVariable @Positive(message = "Số lượng mã giảm giá phải lớn hơn 0") int quantity,
            @Valid @RequestBody CouponRequest couponDTO) {
        return couponService.createCoupon(quantity, couponDTO);
    }

    // Xóa mã giảm giá (admin)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable @Positive(message = "id phải lớn hơn 0") int id) {
        return couponService.deleteCoupon(id);
    }

    // kích hoạt / hủy kích hoạt mã giảm giá (admin)
    @PutMapping("/update/active/{id}")
    public ResponseEntity<?> updateActiveCoupon(@PathVariable @Positive(message = "id phải lớn hơn 0") int id,
            @Valid @RequestBody CouponRequest couponDTO) {
        return couponService.updateActiveCoupon(id, couponDTO);
    }

    // Sử dụng mã giảm giá
    @PutMapping("/update/used")
    public ResponseEntity<?> updateUsedCoupon(@RequestParam @NotBlank(message = "Mã giảm giá không được để trống") String code) {
        return couponService.updateUsedCoupon(code);
    }
}