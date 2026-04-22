package com.example.backend.controller.favorite;

import com.example.backend.dto.request.favorite.FavoriteBookRequest;
import com.example.backend.service.favorite.FavoriteBookService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favorite-book")
@Validated
public class FavoriteBookController {

    @Autowired
    private FavoriteBookService favoriteBookService;

    // Lấy danh sách sách yêu thích của người dùng
    @GetMapping("/get-favorite-book/{idUser}")
    public ResponseEntity<?> getAllFavoriteBookByIdUser(
            @PathVariable @Positive(message = "idUser phải lớn hơn 0") Integer idUser) {
        return favoriteBookService.getAllFavoriteBookByIdUser(idUser);
    }

    // Thêm sách vào danh sách yêu thích
    @PostMapping("/add-book")
    public ResponseEntity<?> addFavoriteBook(@Valid @RequestBody FavoriteBookRequest request) {
        return favoriteBookService.addFavoriteBook(request);
    }

    // Xóa sách khỏi danh sách yêu thích
    @DeleteMapping("/remove-book")
    public ResponseEntity<?> removeFavoriteBook(@Valid @RequestBody FavoriteBookRequest request) {
        return favoriteBookService.removeFavoriteBook(request);
    }
}