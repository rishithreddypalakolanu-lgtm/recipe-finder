package com.recipefinder.repository;

import com.recipefinder.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByAuthorUsername(String username);

    @Query("select r from Recipe r where lower(r.title) like lower(concat('%', :q, '%')) or lower(r.ingredients) like lower(concat('%', :q, '%'))")
    List<Recipe> search(@Param("q") String q);

    List<Recipe> findByCategoryIgnoreCase(String category);
}
