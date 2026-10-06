package com.recipefinder.controller;

import com.recipefinder.dto.RecipeRequest;
import com.recipefinder.model.Recipe;
import com.recipefinder.model.User;
import com.recipefinder.repository.RecipeRepository;
import com.recipefinder.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    private final RecipeRepository recipes;
    private final UserRepository users;

    public RecipeController(RecipeRepository recipes, UserRepository users) {
        this.recipes = recipes;
        this.users = users;
    }

    private String currentUser(HttpSession session) {
        Object username = session.getAttribute("username");
        return username == null ? null : username.toString();
    }

    @GetMapping
    public List<Recipe> all(@RequestParam(required = false) String q,
                            @RequestParam(required = false) String category) {
        if (q != null && !q.isBlank()) return recipes.search(q.trim());
        if (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category))
            return recipes.findByCategoryIgnoreCase(category);
        return recipes.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        return recipes.findById(id).<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody RecipeRequest req, HttpSession session) {
        String username = currentUser(session);
        if (username == null) return ResponseEntity.status(401).body(Map.of("message", "Login required"));
        User author = users.findByUsername(username).orElseThrow();
        Recipe r = new Recipe();
        apply(r, req);
        r.setAuthor(author);
        return ResponseEntity.ok(recipes.save(r));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody RecipeRequest req, HttpSession session) {
        String username = currentUser(session);
        if (username == null) return ResponseEntity.status(401).body(Map.of("message", "Login required"));
        Recipe r = recipes.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();
        if (!r.getAuthor().getUsername().equals(username))
            return ResponseEntity.status(403).body(Map.of("message", "You can edit only your own recipe"));
        apply(r, req);
        return ResponseEntity.ok(recipes.save(r));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, HttpSession session) {
        String username = currentUser(session);
        if (username == null) return ResponseEntity.status(401).body(Map.of("message", "Login required"));
        Recipe r = recipes.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();
        if (!r.getAuthor().getUsername().equals(username))
            return ResponseEntity.status(403).body(Map.of("message", "You can delete only your own recipe"));
        recipes.delete(r);
        return ResponseEntity.ok(Map.of("message", "Recipe deleted"));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> like(@PathVariable Long id, HttpSession session) {
        String username = currentUser(session);
        if (username == null) return ResponseEntity.status(401).body(Map.of("message", "Login required"));
        Recipe r = recipes.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();
        r.setLikes(r.getLikes() + 1);
        return ResponseEntity.ok(recipes.save(r));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<?> favorite(@PathVariable Long id, HttpSession session) {
        String username = currentUser(session);
        if (username == null) return ResponseEntity.status(401).body(Map.of("message", "Login required"));
        Recipe r = recipes.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();

        if (r.getFavorites().contains(username)) r.getFavorites().remove(username);
        else r.getFavorites().add(username);

        return ResponseEntity.ok(recipes.save(r));
    }

    @GetMapping("/mine/list")
    public ResponseEntity<?> mine(HttpSession session) {
        String username = currentUser(session);
        if (username == null) return ResponseEntity.status(401).body(Map.of("message", "Login required"));
        return ResponseEntity.ok(recipes.findByAuthorUsername(username));
    }

    private void apply(Recipe r, RecipeRequest req) {
        r.setTitle(req.title());
        r.setCategory(req.category());
        r.setCookingTime(req.cookingTime());
        r.setIngredients(req.ingredients());
        r.setSteps(req.steps());
        r.setPhotoUrl(req.photoUrl());
    }
}
