package com.example.backend.service.favorite;

import com.example.backend.dao.book.BookRepository;
import com.example.backend.dao.favorite.FavoriteBookRepository;
import com.example.backend.dao.user.UserRepository;
import com.example.backend.dto.request.favorite.FavoriteBookRequest;
import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.dto.response.favorite.FavoriteBookResponse;
import com.example.backend.entity.book.Book;
import com.example.backend.entity.favorite.FavoriteBook;
import com.example.backend.entity.user.User;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.InternalServerException;
import com.example.backend.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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

    // Lấy danh sách sách yêu thích theo id người dùng
    @Override
    public ResponseEntity<?> getAllFavoriteBookByIdUser(Integer idUser) {
        try {
            User user = userRepository.findById(idUser)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));
            List<FavoriteBook> favoriteBookList = favoriteBookRepository.findFavoriteBooksByUser(user);
            List<FavoriteBookResponse> responses = new ArrayList<>();
            for (FavoriteBook favoriteBook : favoriteBookList) {
                responses.add(mapToFavoriteBookResponse(favoriteBook));
            }
            return ResponseEntity.ok().body(ApiResponse.success("Lấy danh sách yêu thích thành công", responses));
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Lấy danh sách yêu thích thất bại", e);
        }
    }

    // Thêm sách yêu thích
    @Override
    public ResponseEntity<?> addFavoriteBook(FavoriteBookRequest request) {
        try {
            Book book = bookRepository.findById(request.getIdBook())
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy sách"));
            User user = userRepository.findById(request.getIdUser())
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

            List<FavoriteBook> existingFavorites = favoriteBookRepository.findFavoriteBooksByUser(user);
            for (FavoriteBook fb : existingFavorites) {
                if (fb.getBook() != null && fb.getBook().getIdBook() == request.getIdBook()) {
                    throw new ConflictException("Sách đã tồn tại trong danh sách yêu thích");
                }
            }

            FavoriteBook favoriteBook = FavoriteBook.builder()
                    .book(book)
                    .user(user)
                    .build();

            FavoriteBook saved = favoriteBookRepository.save(favoriteBook);
            return ResponseEntity.ok().body(ApiResponse.success("Thêm sách yêu thích thành công", mapToFavoriteBookResponse(saved)));
        } catch (NotFoundException | ConflictException e) {
            throw e;
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Thêm sách yêu thích thất bại do dữ liệu xung đột");
        } catch (Exception e) {
            throw new InternalServerException("Thêm sách yêu thích thất bại", e);
        }
    }

    // Xóa sách yêu thích
    @Override
    public ResponseEntity<?> removeFavoriteBook(FavoriteBookRequest request) {
        try {
            User user = userRepository.findById(request.getIdUser())
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));
            List<FavoriteBook> favoriteBooks = favoriteBookRepository.findFavoriteBooksByUser(user);
            for (FavoriteBook fb : favoriteBooks) {
                if (fb.getBook() != null && fb.getBook().getIdBook() == request.getIdBook()) {
                    try {
                        favoriteBookRepository.delete(fb);
                    } catch (DataIntegrityViolationException e) {
                        throw new ConflictException("Xóa sách khỏi danh sách yêu thích thất bại do dữ liệu liên quan");
                    }
                    return ResponseEntity.ok().body(ApiResponse.success("Xóa sách khỏi danh sách yêu thích thành công", new FavoriteBookResponse(request.getIdUser(), request.getIdBook())));
                }
            }

            throw new NotFoundException("Không tìm thấy sách trong danh sách yêu thích");
        } catch (NotFoundException | ConflictException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Xóa sách khỏi danh sách yêu thích thất bại", e);
        }
    }

    private FavoriteBookResponse mapToFavoriteBookResponse(FavoriteBook favoriteBook) {
        return new FavoriteBookResponse(
                favoriteBook.getUser().getIdUser(),
                favoriteBook.getBook().getIdBook()
        );
    }
}
