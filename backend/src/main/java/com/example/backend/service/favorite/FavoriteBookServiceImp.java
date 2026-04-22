package com.example.backend.service.favorite;

import com.example.backend.dao.book.BookRepository;
import com.example.backend.dao.favorite.FavoriteBookRepository;
import com.example.backend.dao.user.UserRepository;
import com.example.backend.dto.request.favorite.FavoriteBookRequest;
import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.entity.book.Book;
import com.example.backend.entity.favorite.FavoriteBook;
import com.example.backend.entity.user.User;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FavoriteBookServiceImp implements FavoriteBookService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FavoriteBookRepository favoriteBookRepository;

    @Autowired
    private BookRepository bookRepository;

    @Override
    public ResponseEntity<?> getAllFavoriteBookByIdUser(Integer idUser) {
        User user = userRepository.findById(idUser)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));
        List<FavoriteBook> favoriteBookList = favoriteBookRepository.findFavoriteBooksByUser(user);
        List<Integer> idBookListOfFavoriteBook = new ArrayList<>();
        for (FavoriteBook favoriteBook : favoriteBookList) {
            idBookListOfFavoriteBook.add(favoriteBook.getBook().getIdBook());
        }
        return ResponseEntity.ok().body(ApiResponse.success("Lấy danh sách yêu thích thành công", idBookListOfFavoriteBook));
    }

    @Override
    public ResponseEntity<?> addFavoriteBook(FavoriteBookRequest request) {
        Book book = bookRepository.findById(request.getIdBook())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sách"));
        User user = userRepository.findById(request.getIdUser())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        List<FavoriteBook> existingFavorites = favoriteBookRepository.findFavoriteBooksByUser(user);
        for (FavoriteBook fb : existingFavorites) {
            if (fb.getBook().getIdBook() == request.getIdBook()) {
                throw new ConflictException("Sách đã tồn tại trong danh sách yêu thích");
            }
        }

        FavoriteBook favoriteBook = FavoriteBook.builder()
                .book(book)
                .user(user)
                .build();

        FavoriteBook saved = favoriteBookRepository.save(favoriteBook);

        return ResponseEntity.ok().body(ApiResponse.success("Thêm sách yêu thích thành công", saved.getIdFavoriteBook()));
    }

    @Override
    public ResponseEntity<?> removeFavoriteBook(FavoriteBookRequest request) {
        User user = userRepository.findById(request.getIdUser())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));
        List<FavoriteBook> favoriteBooks = favoriteBookRepository.findFavoriteBooksByUser(user);
        for (FavoriteBook fb : favoriteBooks) {
            if (fb.getBook().getIdBook() == request.getIdBook()) {
                favoriteBookRepository.delete(fb);
                return ResponseEntity.ok().body(ApiResponse.success("Xóa sách khỏi danh sách yêu thích thành công", null));
            }
        }

        throw new NotFoundException("Không tìm thấy sách trong danh sách yêu thích");
    }
}
