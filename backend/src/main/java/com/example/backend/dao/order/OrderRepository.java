package com.example.backend.dao.order;

import com.example.backend.dto.response.order.TopBuyerResponse;
import com.example.backend.entity.order.Order;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(path = "orders")
public interface OrderRepository extends JpaRepository<Order, Integer> {
	@Query("SELECT new com.example.backend.dto.response.order.TopBuyerResponse(" +
			"u.idUser, u.firstName, u.lastName, u.username, u.phoneNumber, u.avatar, SUM(o.totalPrice)) " +
			"FROM Order o JOIN o.user u " +
			"WHERE o.status = 'Thành công' " +
			"GROUP BY u.idUser, u.firstName, u.lastName, u.username, u.phoneNumber, u.avatar " +
			"ORDER BY SUM(o.totalPrice) DESC")
	List<TopBuyerResponse> findTopBuyers(Pageable pageable);
}
