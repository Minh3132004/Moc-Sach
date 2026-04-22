package com.example.backend.service.book;

import com.example.backend.dto.request.book.BookCreateRequest;
import com.example.backend.dto.request.book.BookUpdateRequest;
import com.example.backend.dao.book.BookRepository;
import com.example.backend.dao.book.GenreRepository;
import com.example.backend.dao.book.ImageRepository;
import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.dto.response.book.BookResponse;
import com.example.backend.entity.book.Book;
import com.example.backend.entity.book.Genre;
import com.example.backend.entity.book.Image;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.InternalServerException;
import com.example.backend.exception.NotFoundException;
import com.example.backend.service.uploadImage.UploadImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookServiceImp implements BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UploadImageService uploadImageService;

    @Autowired
    private GenreRepository genreRepository;

    // Lấy tất cả sách
    @Override
    public ResponseEntity<?> getAllBooks() {
        List<Book> bookList = bookRepository.findAll();
        List<BookResponse> bookDTOList = new ArrayList<>();
        for (Book book : bookList) {
            bookDTOList.add(new BookResponse(book.getIdBook(), book.getNameBook()));
        }
        return ResponseEntity.ok().body(bookDTOList);
    }

    // Tạo sách
    @Override
    @Transactional
    public ResponseEntity<?> createBook(BookCreateRequest bookDTO) {
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
        saveBookImages(savedBook, bookDTO.getImages(), 0);

        return ResponseEntity.ok(savedBook);
    }

    // Cập nhật sách
    @Override
    public ResponseEntity<?> updateBook(BookUpdateRequest bookDTO) {
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

        return ResponseEntity.ok(saveBookOrThrow(existingBook, "Cập nhật sách"));
    }

    // Cập nhật sách với ảnh
    @Override
    @Transactional
    public ResponseEntity<?> updateBookWithImages(BookUpdateRequest bookDTO) {
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
        saveBookImages(existingBook, bookDTO.getNewImages(), keepCount);

        return ResponseEntity.ok(existingBook);
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
    private void saveBookImages(Book book, List<MultipartFile> images, int existingImageCount) {
        if (images == null || images.isEmpty()) {
            return;
        }

        for (int i = 0; i < images.size(); i++) {
            MultipartFile file = images.get(i);
            if (file.isEmpty()) {
                continue;
            }

            String imageName = "Book_" + book.getIdBook() + "_" + System.currentTimeMillis() + "_" + i;
            String imageUrl = uploadImageService.uploadImage(file, imageName);

            Image image = new Image();
            image.setBook(book);
            image.setNameImage(file.getOriginalFilename());
            image.setUrlImage(imageUrl);
            image.setThumbnail(existingImageCount == 0 && i == 0);
            try {
                imageRepository.save(image);
            } catch (DataIntegrityViolationException e) {
                throw new ConflictException("Lưu ảnh sách thất bại do dữ liệu liên quan");
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
}
