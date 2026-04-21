package com.example.backend.dao.order;

import com.example.backend.entity.order.Order;
import com.example.backend.entity.order.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;


@RepositoryRestResource(path = "order-detail")
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    
    // Tìm tất cả chi tiết đơn hàng theo đơn hàng
    List<OrderDetail> findOrderDetailsByOrder(Order order);

    // Tìm tất cả chi tiết đơn hàng chưa được đánh giá của một người dùng
    @Query("SELECT DISTINCT od FROM OrderDetail od " +
            "LEFT JOIN FETCH od.book b " +
            "LEFT JOIN FETCH b.listImages " + // Lấy luôn ảnh
            "JOIN FETCH od.order o " +
            "JOIN FETCH o.user u " +
            "WHERE u.idUser = :userId " +
            "AND od.isReview = false " +
            "AND o.status = 'Thành công'")
    List<OrderDetail> findUnreviewedBooksByUser(@Param("userId") int userId);
}