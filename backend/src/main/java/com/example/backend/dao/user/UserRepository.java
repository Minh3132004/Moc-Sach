package com.example.backend.dao.user;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.user.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Integer> {
    //Tìm kiếm user theo tên đăng nhập
    public boolean existsByUsername(String username);
    //Tìm kiếm user theo email
    public boolean existsByEmail(String email);
    //Tìm kiếm user theo số điện thoại
    public boolean existsByPhoneNumber(String phoneNumber);
    //Tìm kiếm user theo tên đăng nhập
    public User findByUsername(String username);
    //Tìm kiếm user theo email
    public User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "u.phoneNumber LIKE CONCAT('%', :keyword, '%')")
    Page<User> searchUsers(@Param("keyword") String keyword, Pageable pageable);
}
