package com.kh.back.controller.recipe;

import com.kh.back.dto.recipe.request.RecipeDetailDto;
import com.kh.back.service.recipe.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/recipe")
public class RecipeDetailController {

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/save-recipe")
    public ResponseEntity<String> saveRecipe(@RequestHeader("Authorization") String token,@ModelAttribute RecipeDetailDto recipeRequest) {
        String jsonData = recipeService.saveRecipe(token, recipeRequest);
        return ResponseEntity.ok(jsonData);
    }


}
