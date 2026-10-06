package com.recipefinder.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "recipes")
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Integer cookingTime;

    @Column(length = 5000, nullable = false)
    private String ingredients;

    @Column(length = 10000, nullable = false)
    private String steps;

    private String photoUrl;
    private int likes;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @ElementCollection
    @CollectionTable(name = "recipe_favorites", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "username")
    private List<String> favorites = new ArrayList<>();

    public Recipe() {}

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getCategory() { return category; }
    public Integer getCookingTime() { return cookingTime; }
    public String getIngredients() { return ingredients; }
    public String getSteps() { return steps; }
    public String getPhotoUrl() { return photoUrl; }
    public int getLikes() { return likes; }
    public User getAuthor() { return author; }
    public List<String> getFavorites() { return favorites; }

    public void setTitle(String v) { title = v; }
    public void setCategory(String v) { category = v; }
    public void setCookingTime(Integer v) { cookingTime = v; }
    public void setIngredients(String v) { ingredients = v; }
    public void setSteps(String v) { steps = v; }
    public void setPhotoUrl(String v) { photoUrl = v; }
    public void setLikes(int v) { likes = v; }
    public void setAuthor(User v) { author = v; }
    public void setFavorites(List<String> v) { favorites = v; }
}
