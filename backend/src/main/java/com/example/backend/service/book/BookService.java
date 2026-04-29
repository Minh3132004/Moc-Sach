package com.example.backend.service.book;

import com.example.backend.dto.request.book.BookCreateRequest;
import com.example.backend.dto.request.book.BookUpdateRequest;
import org.springframework.http.ResponseEntity;

public interface BookService {
    ResponseEntity<?> getAllBooks(int page, int size);

    ResponseEntity<?> getHotBooks(int size);

    ResponseEntity<?> getNewBooks(int size);

    ResponseEntity<?> getBookById(int id);

    ResponseEntity<?> createBook(BookCreateRequest bookDTO);

    ResponseEntity<?> updateBook(BookUpdateRequest bookDTO);

    ResponseEntity<?> updateBookWithImages(BookUpdateRequest bookDTO);

    ResponseEntity<?> deleteBook(int id);
}
