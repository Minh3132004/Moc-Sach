package com.example.backend.dao.user;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.user.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    //Tìm kiếm user theo tên đăng nhập
    public boolean existsByUsername(String username);
    //Tìm kiếm user theo email
    public boolean existsByEmail(String email);
    //Tìm kiếm user theo tên đăng nhập
    public User findByUsername(String username);
    //Tìm kiếm user theo email
    public User findByEmail(String email);
}
