package com.kh.back.dto.recipe.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class AddCocktailRecipeDto {
    private String postId;
    private String type;
    private String name;
    private String glass;
    private String category;
    private List<Ingredients> Ingredients;
    private String garnish;
    private String preparation;
    private Float abv;
    private MultipartFile image;
   private String existingImage;

    @Data
    public static class Ingredients {
        private String ingredient;
        private Float amount;  // String -> Float로 변경
        private String unit;

    }
}