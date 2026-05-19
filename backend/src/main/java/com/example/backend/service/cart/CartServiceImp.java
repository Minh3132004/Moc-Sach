package com.example.backend.service.cart;

import com.example.backend.dao.book.BookRepository;
import com.example.backend.dao.book.ImageRepository;
import com.example.backend.dao.cart.CartItemRepository;
import com.example.backend.dao.user.UserRepository;
import com.example.backend.dto.request.cart.CartItemRequest;
import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.dto.response.book.BookResponse;
import com.example.backend.dto.response.genre.GenreResponse;
import com.example.backend.dto.response.cart.CartItemDetailResponse;
import com.example.backend.dto.response.cart.CartItemResponse;
import com.example.backend.dto.response.image.ImageResponse;
import com.example.backend.entity.book.Book;
import com.example.backend.entity.book.Genre;
import com.example.backend.entity.book.Image;
import com.example.backend.entity.cart.CartItem;
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
import java.util.Optional;

@Service
public class CartServiceImp implements CartService {
    @Autowired
    public UserRepository userRepository;
    @Autowired
    public CartItemRepository cartItemRepository;
    @Autowired
    public BookRepository bookRepository;
    @Autowired
    public ImageRepository imageRepository;
    

    // Thêm sản phẩm vào giỏ hàng
    @Override
    public ResponseEntity<?> save(CartItemRequest cartItemDTO) {
        Optional<User> user = userRepository.findById(cartItemDTO.getIdUser());
        Optional<Book> book = bookRepository.findById(cartItemDTO.getIdBook());
        if (user.isEmpty()) {
            throw new NotFoundException("Không tìm thấy người dùng");
        }
        if (book.isEmpty()) {
            throw new NotFoundException("Không tìm thấy sách");
        }

        // Kiểm tra xem sách này đã có trong giỏ hàng của user chưa
        Optional<CartItem> existingCartItem = cartItemRepository.findByUser_IdUserAndBook_IdBook(cartItemDTO.getIdUser(), cartItemDTO.getIdBook());
        
        CartItem cartItem;
        if (existingCartItem.isPresent()) {
            // Nếu có rồi, cộng dồn số lượng
            cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + cartItemDTO.getQuantity());
        } else {
            // Nếu chưa có, tạo mới
            cartItem = new CartItem();
            cartItem.setUser(user.get());
            cartItem.setBook(book.get());
            cartItem.setQuantity(cartItemDTO.getQuantity());
        }

        try {
            CartItem savedCartItem = cartItemRepository.save(cartItem);
            String message = existingCartItem.isPresent() ? "Đã cộng dồn số lượng sản phẩm trong giỏ" : "Đã thêm sản phẩm vào giỏ hàng";
            return ResponseEntity.ok(ApiResponse.success(message, mapToCartItemResponse(savedCartItem)));
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Thêm sản phẩm vào giỏ hàng thất bại do dữ liệu xung đột");
        } catch (Exception e) {
            throw new InternalServerException("Thêm sản phẩm vào giỏ hàng thất bại", e);
        }
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    @Override
    public ResponseEntity<?> updateQuantity(int idCart, CartItemRequest cartItemDTO) {
        Optional<CartItem> cartItem = cartItemRepository.findById(idCart);
        if (cartItem.isPresent()) {
            cartItem.get().setQuantity(cartItemDTO.getQuantity());
            try {
                CartItem savedCartItem = cartItemRepository.save(cartItem.get());
                return ResponseEntity.ok(ApiResponse.success("Đã cập nhật số lượng sản phẩm trong giỏ hàng", mapToCartItemResponse(savedCartItem)));
            } catch (DataIntegrityViolationException e) {
                throw new ConflictException("Cập nhật giỏ hàng thất bại do dữ liệu xung đột");
            } catch (Exception e) {
                throw new InternalServerException("Cập nhật giỏ hàng thất bại", e);
            }
        }
        throw new NotFoundException("Không tìm thấy sản phẩm trong giỏ hàng");
    }

    // Lấy danh sách sản phẩm trong giỏ hàng theo id người dùng
    @Override
    public ResponseEntity<?> getCartItemsByUserId(int idUser) {
        Optional<User> user = userRepository.findById(idUser);
        if (user.isEmpty()) {
            throw new NotFoundException("Không tìm thấy người dùng");
        }

        try {
            List<CartItem> cartItems = cartItemRepository.findByUser_IdUser(idUser);
            List<CartItemDetailResponse> cartItemResponses = new ArrayList<>();
            for (CartItem cartItem : cartItems) {
                cartItemResponses.add(mapToCartItemDetailResponse(cartItem));
            }
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách giỏ hàng thành công", cartItemResponses));
        } catch (Exception e) {
            throw new InternalServerException("Lấy danh sách giỏ hàng thất bại", e);
        }
    }

    @Override
    public ResponseEntity<?> delete(int idCart) {
        Optional<CartItem> cartItem = cartItemRepository.findById(idCart);
        if (cartItem.isPresent()) {
            try {
                cartItemRepository.delete(cartItem.get());
                return ResponseEntity.ok(ApiResponse.success("Đã xóa sản phẩm khỏi giỏ hàng", null));
            } catch (Exception e) {
                throw new InternalServerException("Xóa sản phẩm khỏi giỏ hàng thất bại", e);
            }
        }
        throw new NotFoundException("Không tìm thấy sản phẩm trong giỏ hàng");
    }

    private CartItemResponse mapToCartItemResponse(CartItem cartItem) {
        return new CartItemResponse(
                cartItem.getBook().getIdBook(),
                cartItem.getQuantity(),
                cartItem.getUser().getIdUser()
        );
    }

    private CartItemDetailResponse mapToCartItemDetailResponse(CartItem cartItem) {
        Book book = cartItem.getBook();
        BookResponse bookResponse = mapToBookResponse(book);
        
        List<ImageResponse> imageResponses = new ArrayList<>();
        List<Image> images = imageRepository.findByBook_IdBook(book.getIdBook());
        if (images != null) {
            for (Image image : images) {
                imageResponses.add(new ImageResponse(
                        image.getIdImage(),
                        image.getNameImage(),
                        image.isThumbnail(),
                        image.getUrlImage()
                ));
            }
        }

        return new CartItemDetailResponse(
                cartItem.getIdCart(),
                cartItem.getQuantity(),
                cartItem.getUser().getIdUser(),
                bookResponse,
                imageResponses
        );
    }

    private BookResponse mapToBookResponse(Book book) {
        List<GenreResponse> genres = null;
        if (book.getListGenres() != null && !book.getListGenres().isEmpty()) {
            genres = new ArrayList<>();
            for (Genre g : book.getListGenres()) {
                genres.add(new GenreResponse(g.getIdGenre(), g.getNameGenre()));
            }
        }
        return new BookResponse(
                book.getIdBook(),
                book.getNameBook(),
                book.getAuthor(),
                book.getDescription(),
                book.getListPrice(),
                book.getSellPrice(),
                book.getQuantity(),
                book.getAvgRating(),
                book.getSoldQuantity(),
                book.getDiscountPercent(),
                genres,
                null
        );
    }
}
