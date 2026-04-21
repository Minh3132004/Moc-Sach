package com.example.backend.dao.favorite;

import com.example.backend.entity.favorite.FavoriteBook;
import com.example.backend.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;


@RepositoryRestResource(path = "favorite-books")
public interface FavoriteBookRepository extends JpaRepository<FavoriteBook, Integer> {

    //Tìm tất cả favorite book theo user
    public List<FavoriteBook> findFavoriteBooksByUser(User user);
}
