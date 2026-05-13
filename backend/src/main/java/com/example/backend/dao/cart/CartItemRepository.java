package com.example.backend.dao.cart;

import com.example.backend.entity.cart.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(path = "cart-items")
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    @Transactional
    @Modifying
    void deleteByUser_IdUser(int idUser);

    // Tìm kiếm cart item theo user
    List<CartItem> findByUser_IdUser(int idUser);

    // Tìm kiếm cart item theo user và book (kiểm tra xem sách này đã có trong giỏ hàng của user chưa)
    Optional<CartItem> findByUser_IdUserAndBook_IdBook(int idUser, int idBook);
}
