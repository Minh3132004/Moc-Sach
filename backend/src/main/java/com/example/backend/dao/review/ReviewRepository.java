package com.example.backend.dao.review;

import com.example.backend.entity.book.Book;
import com.example.backend.entity.review.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(path = "reviews")
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Tìm review theo sách
    List<Review> findByBook(Book book);
}