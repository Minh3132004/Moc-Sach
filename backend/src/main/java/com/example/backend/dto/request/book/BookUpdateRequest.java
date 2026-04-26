package com.example.backend.dto.request.book;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookUpdateRequest {
    @Positive(message = "idBook phải lớn hơn 0")
    private int idBook;

    @NotBlank(message = "Tên sách không được để trống")
    private String nameBook;

    @NotBlank(message = "Tác giả không được để trống")
    private String author;

    @Positive(message = "Giá niêm yết phải lớn hơn 0")
    private double listPrice;

    @PositiveOrZero(message = "Số lượng phải lớn hơn hoặc bằng 0")
    private int quantity;

    private String description;

    @PositiveOrZero(message = "Giảm giá phải lớn hơn hoặc bằng 0")
    private int discountPercent;

    @NotEmpty(message = "Vui lòng chọn ít nhất một thể loại")
    private List<Integer> genreIds;

    private List<Integer> keepImageIds; //Giữ ảnh cũ

    private List<String> newImageUrls; //Thêm ảnh mới
}
