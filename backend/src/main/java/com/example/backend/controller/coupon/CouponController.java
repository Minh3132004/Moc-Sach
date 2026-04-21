package com.example.backend.controller.coupon;

import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.dto.response.coupon.CouponResponse;
import com.example.backend.service.coupon.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/coupon")
public class CouponController {
    @Autowired
    private CouponService couponService;

    // Kiểm tra mã giảm giá
    @GetMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestParam String code) {
        return couponService.validateCoupon(code);
    }

    // Tạo mã giảm giá (admin)
    @PostMapping("/create/{quantity}")
    public ResponseEntity<?> createCoupon(@PathVariable int quantity, @RequestBody CouponResponse couponDTO) {
        if(quantity <= 0){
            return ResponseEntity.badRequest().body(ApiResponse.error("Số lượng mã giảm giá phải lớn hơn 0"));
        }
        return couponService.createCoupon(quantity, couponDTO);
    }

    // Xóa mã giảm giá (admin)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable int id) {
        return couponService.deleteCoupon(id);
    }

    // kích hoạt / hủy kích hoạt mã giảm giá (admin)
    @PutMapping("/update/active/{id}")
    public ResponseEntity<?> updateActiveCoupon(@PathVariable int id, @RequestBody CouponResponse couponDTO) {
        return couponService.updateActiveCoupon(id, couponDTO);
    }

    // Sử dụng mã giảm giá
    @PutMapping("/update/used")
    public ResponseEntity<?> updateUsedCoupon(@RequestParam String code) {
        return couponService.updateUsedCoupon(code);
    }
}