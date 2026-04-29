package com.example.backend.controller.book;

import com.example.backend.dto.request.book.BookCreateRequest;
import com.example.backend.dto.request.book.BookUpdateRequest;
import com.example.backend.service.book.BookService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<?> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return bookService.getAllBooks(page, size);
    }

    @GetMapping("/hot")
    public ResponseEntity<?> getHotBooks(@RequestParam(defaultValue = "4") int size) {
        return bookService.getHotBooks(size);
    }

    @GetMapping("/new")
    public ResponseEntity<?> getNewBooks(@RequestParam(defaultValue = "4") int size) {
        return bookService.getNewBooks(size);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getBookById(@PathVariable @Positive(message = "id phải lớn hơn 0") int id) {
        return bookService.getBookById(id);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBook(@Valid @RequestBody BookCreateRequest bookDTO) {
        return bookService.createBook(bookDTO);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateBook(@Valid @RequestBody BookUpdateRequest bookDTO) {
        return bookService.updateBook(bookDTO);
    }

    @PutMapping("/update-with-images")
    public ResponseEntity<?> updateBookWithImages(@Valid @RequestBody BookUpdateRequest bookDTO) {
        return bookService.updateBookWithImages(bookDTO);
    }

    @DeleteMapping("/delete-by-id/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable @Positive(message = "id phải lớn hơn 0") int id) {
        return bookService.deleteBook(id);
    }
}
