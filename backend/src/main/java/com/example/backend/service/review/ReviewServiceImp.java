package com.example.backend.service.review;

import com.example.backend.dao.book.BookRepository;
import com.example.backend.dao.order.OrderDetailRepository;
import com.example.backend.dao.review.ReviewRepository;
import com.example.backend.dao.user.UserRepository;
import com.example.backend.dto.request.review.SubmitReviewRequest;
import com.example.backend.dto.response.api.ApiResponse;
import com.example.backend.dto.response.book.BookToReviewResponse;
import com.example.backend.entity.book.Book;
import com.example.backend.entity.book.Image;
import com.example.backend.entity.order.OrderDetail;
import com.example.backend.entity.review.Review;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ConflictException;
import com.example.backend.exception.InternalServerException;
import com.example.backend.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewServiceImp implements ReviewService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;

    // Lấy tất cả các sách chưa đánh giá từ người dùng
    @Override
    public ResponseEntity<?> getBooksToReview(int userId) {
        try {
            if (!userRepository.existsById(userId)) {
                throw new NotFoundException("Không tìm thấy người dùng");
            }

            List<OrderDetail> listEntities = orderDetailRepository.findUnreviewedBooksByUser(userId);
            List<BookToReviewResponse> listDTOs = new ArrayList<>();

            for (OrderDetail od : listEntities) {
                if (od == null) {
                    continue;
                }

                Book book = od.getBook();
                if (book == null) {
                    throw new NotFoundException("Không tìm thấy sách");
                }

                if (od.getOrder() == null) {
                    throw new NotFoundException("Không tìm thấy đơn hàng");
                }

                String imgUrl = "https://via.placeholder.com/150";
                if (book.getListImages() != null && !book.getListImages().isEmpty()) {
                    imgUrl = book.getListImages().stream()
                            .filter(img -> img != null && img.isThumbnail())
                            .findFirst()
                            .map(Image::getUrlImage)
                            .orElse(book.getListImages().get(0) != null ? book.getListImages().get(0).getUrlImage() : imgUrl);
                }

                listDTOs.add(new BookToReviewResponse(
                        od.getIdOrderDetail(),
                        book.getNameBook(),
                        book.getAuthor(),
                        imgUrl,
                        od.getOrder().getIdOrder(),
                        od.getOrder().getDateCreated()
                ));
            }

            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách chờ đánh giá thành công", listDTOs));
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalServerException("Lấy danh sách chờ đánh giá thất bại", e);
        }
    }

    // Gửi review đánh giá sách
    @Override
    @Transactional
    public ResponseEntity<?> submitReview(SubmitReviewRequest request) {
        try {
            if (request == null) {
                throw new BadRequestException("Dữ liệu đánh giá không hợp lệ");
            }

            long idOrderDetail = request.getIdOrderDetail();
            OrderDetail od = orderDetailRepository.findById(idOrderDetail)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy chi tiết đơn hàng"));

            int ratingPoint = request.getRatingPoint();
            String content = request.getContent();
            if (content == null || content.trim().isEmpty()) {
                content = "";
            } else {
                content = content.trim();
            }

            if (od.isReview()) {
                throw new ConflictException("Đơn hàng này đã được đánh giá");
            }

            if (od.getOrder() == null || od.getOrder().getUser() == null) {
                throw new NotFoundException("Không tìm thấy đơn hàng hoặc người dùng");
            }
            if (od.getBook() == null) {
                throw new NotFoundException("Không tìm thấy sách");
            }

            Review review = new Review();
            review.setContent(content);
            review.setRatingPoint(ratingPoint);
            review.setTimestamp(Timestamp.from(Instant.now()));
            review.setBook(od.getBook());
            review.setUser(od.getOrder().getUser());
            review.setOrderDetail(od);

            reviewRepository.save(review);

            od.setReview(true);
            orderDetailRepository.save(od);

            updateBookRating(od.getBook());
            return ResponseEntity.ok(ApiResponse.success("Đánh giá thành công!", null));
        } catch (BadRequestException | NotFoundException | ConflictException e) {
            throw e;
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Gửi đánh giá thất bại do dữ liệu xung đột");
        } catch (Exception e) {
            throw new InternalServerException("Gửi đánh giá thất bại", e);
        }
    }

    // Update rating của sách sau khi đánh giá xong
    private void updateBookRating(Book book) {
        if (book == null) return;
        List<Review> reviews = reviewRepository.findByBook(book);
        if (reviews.isEmpty()) {
            book.setAvgRating(0);
        } else {
            double sum = 0;
            for (Review r : reviews) {
                sum += r.getRatingPoint();
            }
            book.setAvgRating(sum / reviews.size());
        }
        bookRepository.save(book);
    }
}