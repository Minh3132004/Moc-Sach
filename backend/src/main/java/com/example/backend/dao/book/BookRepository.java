package com.example.backend.dao.book;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.example.backend.entity.book.Book;

@RepositoryRestResource(path = "books")
public interface BookRepository extends JpaRepository<Book, Integer> {
    Page<Book> findByListGenres_IdGenre(int idGenre, Pageable pageable);
}
