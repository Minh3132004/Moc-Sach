package com.example.backend.dto.response.book;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookPageResponse {
    private List<BookResponse> bookList;
    private long totalElements;
    private int totalPages;
    private int size;
}