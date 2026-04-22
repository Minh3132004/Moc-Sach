package com.example.backend.service.book;

import com.example.backend.dto.request.book.BookCreateRequest;
import com.example.backend.dto.request.book.BookUpdateRequest;
import org.springframework.http.ResponseEntity;

public interface BookService {
    ResponseEntity<?> getAllBooks();

    ResponseEntity<?> createBook(BookCreateRequest bookDTO);

    ResponseEntity<?> updateBook(BookUpdateRequest bookDTO);

    ResponseEntity<?> updateBookWithImages(BookUpdateRequest bookDTO);

    ResponseEntity<?> deleteBook(int id);
}
