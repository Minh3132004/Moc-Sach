package com.example.backend.service.book;

import com.example.backend.dto.request.book.BookCreateRequest;
import com.example.backend.dto.request.book.BookUpdateRequest;
import com.example.backend.dao.book.BookRepository;
import com.example.backend.dao.book.GenreRepository;
import com.example.backend.dao.book.ImageRepository;
import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.dto.response.book.BookPageResponse;
import com.example.backend.dto.response.book.BookResponse;
import com.example.backend.entity.book.Book;
import com.example.backend.entity.book.Genre;
import com.example.backend.entity.book.Image;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.InternalServerException;
import com.example.backend.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookServiceImp implements BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private GenreRepository genreRepository;

    // Lấy tất cả sách
    @Override
    public ResponseEntity<?> getAllBooks(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Book> bookPage = bookRepository.findAll(pageable);
            List<Book> bookList = bookPage.getContent();
            List<BookResponse> bookDTOList = new ArrayList<>();
            for (Book book : bookList) {
                bookDTOList.add(mapToBookResponse(book));
            }
            BookPageResponse response = new BookPageResponse(
                    bookDTOList,
                    bookPage.getTotalElements(),
                    bookPage.getTotalPages(),
                    bookPage.getSize()
            );
            return ResponseEntity.ok().body(ApiResponse.success("Lấy danh sách sách thành công", response));
        } catch (Exception e) {
            throw new InternalServerException("Lấy danh sách sách thất bại", e);
        }
    }

    // Lấy sách bán chạy
    @Override
    public ResponseEntity<?> getHotBooks(int size) {
        try {
            Pageable pageable = PageRequest.of(
                    0,
                    size,
                    Sort.by(Sort.Direction.DESC, "soldQuantity").and(Sort.by(Sort.Direction.DESC, "avgRating"))
            );
            Page<Book> bookPage = bookRepository.findAll(pageable);
            List<Book> bookList = bookPage.getContent();
            List<BookResponse> bookDTOList = new ArrayList<>();
            for (Book book : bookList) {
                bookDTOList.add(mapToBookResponse(book));
            }
            BookPageResponse response = new BookPageResponse(
                    bookDTOList,
                    bookPage.getTotalElements(),
                    bookPage.getTotalPages(),
                    bookPage.getSize()
            );
            return ResponseEntity.ok().body(ApiResponse.success("Lấy sách bán chạy thành công", response));
        } catch (Exception e) {
            throw new InternalServerException("Lấy sách bán chạy thất bại", e);
        }
    }

    // Lấy sách mới
    @Override
    public ResponseEntity<?> getNewBooks(int size) {
        try {
            Pageable pageable = PageRequest.of(
                    0,
                    size,
                    Sort.by(Sort.Direction.DESC, "idBook")
            );
            Page<Book> bookPage = bookRepository.findAll(pageable);
            List<Book> bookList = bookPage.getContent();
            List<BookResponse> bookDTOList = new ArrayList<>();
            for (Book book : bookList) {
                bookDTOList.add(mapToBookResponse(book));
            }
            BookPageResponse response = new BookPageResponse(
                    bookDTOList,
                    bookPage.getTotalElements(),
                    bookPage.getTotalPages(),
                    bookPage.getSize()
            );
            return ResponseEntity.ok().body(ApiResponse.success("Lấy sách mới thành công", response));
        } catch (Exception e) {
            throw new InternalServerException("Lấy sách mới thất bại", e);
        }
    }

    // Lấy sách theo id
    @Override
    public ResponseEntity<?> getBookById(int id) {
        try {
            Book book = bookRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy sách với ID: " + id));
            return ResponseEntity.ok().body(ApiResponse.success("Lấy sách thành công", mapToBookResponse(book)));
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Lấy sách thất bại", e);
        }
    }

    // Tạo sách
    @Override
    @Transactional
    public ResponseEntity<?> createBook(BookCreateRequest bookDTO) {
        try {
            validateCreateRequest(bookDTO);
            List<Genre> genres = resolveGenres(bookDTO.getGenreIds());

            Book book = new Book();
            book.setNameBook(bookDTO.getNameBook());
            book.setAuthor(bookDTO.getAuthor());
            book.setDescription(bookDTO.getDescription());
            book.setListPrice(bookDTO.getListPrice());
            book.setQuantity(bookDTO.getQuantity());
            book.setDiscountPercent(bookDTO.getDiscountPercent());
            book.setAvgRating(0.0);
            book.setSoldQuantity(0);
            book.setSellPrice(bookDTO.getListPrice() - (bookDTO.getListPrice() * bookDTO.getDiscountPercent() / 100));
            book.setListGenres(genres);

            Book savedBook = saveBookOrThrow(book, "Tạo sách");
            saveBookImages(savedBook, bookDTO.getImageUrls(), 0);

            return ResponseEntity.ok(ApiResponse.success("Tạo sách thành công", mapToBookResponse(savedBook)));
        } catch (BadRequestException | NotFoundException | ConflictException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Tạo sách thất bại", e);
        }
    }

    // Cập nhật sách
    @Override
    public ResponseEntity<?> updateBook(BookUpdateRequest bookDTO) {
        try {
            validateUpdateRequest(bookDTO);
            Book existingBook = bookRepository.findById(bookDTO.getIdBook())
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy sách với ID: " + bookDTO.getIdBook()));

            existingBook.setNameBook(bookDTO.getNameBook());
            existingBook.setAuthor(bookDTO.getAuthor());
            existingBook.setDescription(bookDTO.getDescription());
            existingBook.setListPrice(bookDTO.getListPrice());
            existingBook.setQuantity(bookDTO.getQuantity());
            existingBook.setDiscountPercent(bookDTO.getDiscountPercent());
            existingBook.setSellPrice(bookDTO.getListPrice() - (bookDTO.getListPrice() * bookDTO.getDiscountPercent() / 100));
            existingBook.setListGenres(resolveGenres(bookDTO.getGenreIds()));

            Book savedBook = saveBookOrThrow(existingBook, "Cập nhật sách");
            return ResponseEntity.ok(ApiResponse.success("Cập nhật sách thành công", mapToBookResponse(savedBook)));
        } catch (BadRequestException | NotFoundException | ConflictException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Cập nhật sách thất bại", e);
        }
    }

    // Cập nhật sách với ảnh
    @Override
    @Transactional
    public ResponseEntity<?> updateBookWithImages(BookUpdateRequest bookDTO) {
        try {
            validateUpdateRequest(bookDTO);
            Book existingBook = bookRepository.findById(bookDTO.getIdBook())
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy sách với ID: " + bookDTO.getIdBook()));

            existingBook.setNameBook(bookDTO.getNameBook());
            existingBook.setAuthor(bookDTO.getAuthor());
            existingBook.setDescription(bookDTO.getDescription());
            existingBook.setListPrice(bookDTO.getListPrice());
            existingBook.setQuantity(bookDTO.getQuantity());
            existingBook.setDiscountPercent(bookDTO.getDiscountPercent());
            existingBook.setSellPrice(bookDTO.getListPrice() - (bookDTO.getListPrice() * bookDTO.getDiscountPercent() / 100));
            existingBook.setListGenres(resolveGenres(bookDTO.getGenreIds()));
            saveBookOrThrow(existingBook, "Cập nhật sách");

            List<Image> currentImages = imageRepository.findByBook_IdBook(bookDTO.getIdBook());
            try {
                if (bookDTO.getKeepImageIds() != null) {
                    for (Image image : currentImages) {
                        if (!bookDTO.getKeepImageIds().contains(image.getIdImage())) {
                            imageRepository.delete(image);
                        }
                    }
                } else {
                    imageRepository.deleteAll(currentImages);
                }
            } catch (DataIntegrityViolationException e) {
                throw new ConflictException("Cập nhật ảnh sách thất bại do dữ liệu liên quan");
            } catch (Exception e) {
                throw new InternalServerException("Cập nhật ảnh sách thất bại", e);
            }

            int keepCount = bookDTO.getKeepImageIds() != null ? bookDTO.getKeepImageIds().size() : 0;
            saveBookImages(existingBook, bookDTO.getNewImageUrls(), keepCount);

            return ResponseEntity.ok(ApiResponse.success("Cập nhật sách thành công", mapToBookResponse(existingBook)));
        } catch (BadRequestException | NotFoundException | ConflictException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Cập nhật sách thất bại", e);
        }
    }

    @Override
    public ResponseEntity<?> deleteBook(int id) {
        try {
            Book existingBook = bookRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy sách với ID: " + id));

            bookRepository.delete(existingBook);
            return ResponseEntity.ok(ApiResponse.success("Xóa sách thành công!", null));
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Không thể xóa sách này vì đã có dữ liệu liên quan.");
        } catch (Exception e) {
            throw new InternalServerException("Xóa sách thất bại", e);
        }
    }

    // Chọn thể loại
    private List<Genre> resolveGenres(List<Integer> genreIds) {
        if (genreIds == null || genreIds.isEmpty()) {
            throw new BadRequestException("Vui lòng chọn ít nhất một thể loại");
        }

        List<Genre> genres = new ArrayList<>();
        for (Integer genreId : genreIds) {
            Genre genre = genreRepository.findById(genreId)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy thể loại ID: " + genreId));
            genres.add(genre);
        }
        return genres;
    }

    // Lưu ảnh sách
    private void saveBookImages(Book book, List<String> imageUrls, int existingImageCount) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return;
        }

        for (int i = 0; i < imageUrls.size(); i++) {
            String imageUrl = imageUrls.get(i);
            if (imageUrl == null || imageUrl.isEmpty()) {
                continue;
            }

            Image image = new Image();
            image.setBook(book);
            image.setNameImage("Book_" + book.getIdBook() + "_" + i);
            image.setUrlImage(imageUrl);
            image.setThumbnail(existingImageCount == 0 && i == 0);
            try {
                imageRepository.save(image);
            } catch (DataIntegrityViolationException e) {
                throw new ConflictException("Lưu ảnh sách thất bại do dữ liệu xung đột");
            } catch (Exception e) {
                throw new InternalServerException("Lưu ảnh sách thất bại", e);
            }
        }
    }

    private Book saveBookOrThrow(Book book, String actionName) {
        try {
            return bookRepository.save(book);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException(actionName + " thất bại do dữ liệu xung đột");
        } catch (Exception e) {
            throw new InternalServerException(actionName + " thất bại", e);
        }
    }

    private void validateCreateRequest(BookCreateRequest bookDTO) {
        if (bookDTO == null) {
            throw new BadRequestException("Dữ liệu tạo sách không hợp lệ");
        }
    }

    private void validateUpdateRequest(BookUpdateRequest bookDTO) {
        if (bookDTO == null) {
            throw new BadRequestException("Dữ liệu cập nhật sách không hợp lệ");
        }
    }

    private BookResponse mapToBookResponse(Book book) {
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
                book.getDiscountPercent()
        );
    }
}
