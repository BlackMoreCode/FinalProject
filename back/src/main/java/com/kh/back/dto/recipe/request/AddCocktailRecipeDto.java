package com.kh.back.dto.recipe.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class AddCocktailRecipeDto {
    private String type;
    private String name;
    private String glass;
    private String category;
    private List<Ingredient> ingredients;
    private String garnish;
    private String preparation;
    private Float abv;
    private MultipartFile image;

    @Data
    public static class Ingredient {
        private String ingredient;
        private Float amount;  // String -> Float로 변경
        private String unit;
        private String special;
    }
}