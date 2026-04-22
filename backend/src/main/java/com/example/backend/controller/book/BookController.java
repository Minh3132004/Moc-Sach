package com.example.backend.controller.book;

import com.example.backend.dto.request.book.BookCreateRequest;
import com.example.backend.dto.request.book.BookUpdateRequest;
import com.example.backend.service.book.BookService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/books")
@Validated
public class BookController {
    @Autowired
    private BookService bookService;

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllBooks() {
        return bookService.getAllBooks();
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createBook(@Valid @ModelAttribute BookCreateRequest bookDTO) {
        return bookService.createBook(bookDTO);
    }

    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBook(@Valid @ModelAttribute BookUpdateRequest bookDTO) {
        return bookService.updateBook(bookDTO);
    }

    @PutMapping(value = "/update-with-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBookWithImages(@Valid @ModelAttribute BookUpdateRequest bookDTO) {
        return bookService.updateBookWithImages(bookDTO);
    }

    @DeleteMapping("/delete-by-id/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable @Positive(message = "id phải lớn hơn 0") int id) {
        return bookService.deleteBook(id);
    }
}
