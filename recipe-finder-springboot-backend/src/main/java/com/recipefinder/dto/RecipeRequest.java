package com.recipefinder.dto;

import jakarta.validation.constraints.*;

public record RecipeRequest(
    @NotBlank String title,
    @NotBlank String category,
    @NotNull @Min(1) Integer cookingTime,
    @NotBlank String ingredients,
    @NotBlank String steps,
    String photoUrl
) {}
