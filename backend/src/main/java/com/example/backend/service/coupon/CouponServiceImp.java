package com.example.backend.service.coupon;

import com.example.backend.dao.coupon.CouponRepository;
import com.example.backend.dao.user.UserRepository;
import com.example.backend.dto.request.coupon.CouponRequest;
import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.dto.response.coupon.CouponResponse;
import com.example.backend.entity.coupon.Coupon;
import com.example.backend.entity.user.User;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.InternalServerException;
import com.example.backend.exception.NotFoundException;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.sql.Date;
import java.time.LocalDate;

@Service
public class CouponServiceImp implements CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private UserRepository userRepository;

    // Xử lý kiểm tra mã giảm giá
    @Override
    public ResponseEntity<?> validateCoupon(String code) {
        try {
            Coupon coupon = couponRepository.findByCode(code)
                    .orElseThrow(() -> new NotFoundException("Mã giảm giá không tồn tại"));

            LocalDate today = LocalDate.now();
            if (coupon.getExpiryDate().before(Date.valueOf(today))) {
                throw new BadRequestException("Mã giảm giá đã hết hạn");
            }

            if (!coupon.isActive()) {
                throw new BadRequestException("Mã giảm giá hiện không hoạt động");
            }

            return ResponseEntity.ok(ApiResponse.success("Mã giảm giá hợp lệ", mapToCouponResponse(coupon)));
        } catch (BadRequestException | NotFoundException e) {
            throw e;
        } catch (Exception ex) {
            throw new InternalServerException("Kiểm tra mã giảm giá thất bại", ex);
        }
    }

    //Tạo mã giảm giá
    @Override
    @Transactional
    public ResponseEntity<?> createCoupon(int quantity, CouponRequest couponDTO) {
        try {
            List<CouponResponse> createdCoupons = new ArrayList<>();
            for (int i = 0; i < quantity; i++) {
                Coupon coupon = new Coupon();
                coupon.setCode(generateCodeCoupon());
                coupon.setDiscountPercent(couponDTO.getDiscountPercent());
                coupon.setExpiryDate(couponDTO.getExpiryDate());
                coupon.setActive(true);
                Coupon savedCoupon = couponRepository.save(coupon);
                createdCoupons.add(mapToCouponResponse(savedCoupon));
            }
            return ResponseEntity.ok(ApiResponse.success("Tạo mã giảm giá thành công", createdCoupons));
        } catch (Exception ex) {
            throw new InternalServerException("Tạo mã giảm giá thất bại", ex);
        }
    }

    // Xóa mã giảm giá
    @Override
    public ResponseEntity<?> deleteCoupon(int id) {
        try {
            if (!couponRepository.existsById(id)) {
                throw new NotFoundException("Mã giảm giá không tồn tại");
            }

            couponRepository.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa mã giảm giá thành công", null));
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception ex) {
            throw new InternalServerException("Xóa mã giảm giá thất bại", ex);
        }
    }

    // Cập nhật trạng thái hoạt động của mã giảm giá
    @Override
    public ResponseEntity<?> updateActiveCoupon(int id, CouponRequest couponDTO) {
        try {
            Coupon coupon = couponRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Mã giảm giá không tồn tại"));
            coupon.setActive(couponDTO.isActive());

            Coupon savedCoupon = couponRepository.save(coupon);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật mã giảm giá thành công", mapToCouponResponse(savedCoupon)));
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception ex) {
            throw new InternalServerException("Cập nhật mã giảm giá thất bại", ex);
        }
    }

    // Cập nhật người sử dụng mã giảm giá
    @Override
    @Transactional
    public ResponseEntity<?> updateUsedCoupon(String code, int idUser) {
        try {
            Coupon coupon = couponRepository.findByCode(code)
                    .orElseThrow(() -> new NotFoundException("Mã giảm giá không tồn tại"));

            User user = userRepository.findById(idUser)
                    .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));

            LocalDate today = LocalDate.now();
            if (coupon.getExpiryDate().before(Date.valueOf(today))) {
                throw new BadRequestException("Mã giảm giá đã hết hạn");
            }

            if (!coupon.isActive()) {
                throw new BadRequestException("Mã giảm giá hiện không hoạt động");
            }

            if (coupon.getListUsersUsed() != null && coupon.getListUsersUsed().contains(user)) {
                throw new BadRequestException("Người dùng đã sử dụng mã giảm giá này");
            }

            if (coupon.getListUsersUsed() == null) {
                coupon.setListUsersUsed(new ArrayList<>());
            }
            coupon.getListUsersUsed().add(user);

            Coupon savedCoupon = couponRepository.save(coupon);
            return ResponseEntity.ok(ApiResponse.success("Áp dụng mã giảm giá thành công", mapToCouponResponse(savedCoupon)));
        } catch (BadRequestException | NotFoundException e) {
            throw e;
        } catch (Exception ex) {
            throw new InternalServerException("Cập nhật trạng thái sử dụng mã giảm giá thất bại", ex);
        }
    }

    // Hàm sinh mã giảm giá ngẫu nhiên
    private String generateCodeCoupon() {
        return RandomStringUtils.random(12, true, true); // (số lượng , từ , số)
    }

    private CouponResponse mapToCouponResponse(Coupon coupon) {
        return new CouponResponse(coupon.getDiscountPercent(), coupon.getExpiryDate(), coupon.isActive());
    }
}