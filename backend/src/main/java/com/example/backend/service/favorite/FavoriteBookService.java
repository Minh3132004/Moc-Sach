package com.example.backend.service.favorite;

import com.example.backend.dto.request.favorite.FavoriteBookRequest;
import org.springframework.http.ResponseEntity;

public interface FavoriteBookService {
    ResponseEntity<?> getAllFavoriteBookByIdUser(Integer idUser);

    ResponseEntity<?> addFavoriteBook(FavoriteBookRequest request);

    ResponseEntity<?> removeFavoriteBook(FavoriteBookRequest request);
}
