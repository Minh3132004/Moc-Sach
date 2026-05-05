package com.example.backend.dao.review;

import com.example.backend.entity.book.Book;
import com.example.backend.entity.review.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Tìm review theo sách
    List<Review> findByBook(Book book);

    List<Review> findByBook_IdBookOrderByTimestampDesc(int idBook);
}