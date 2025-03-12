package com.kh.back.controller.recipe;

import com.kh.back.dto.recipe.request.AddCocktailRecipeDto;
import com.kh.back.dto.recipe.request.AddFoodRecipeDto;
import com.kh.back.service.member.MemberService;
import com.kh.back.service.recipe.AddCocktailRecipeService;
import com.kh.back.service.recipe.AddFoodRecipeService;
import com.kh.back.service.redis.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/recipe")
public class RecipeDetailController {
    @Autowired
    private RedisService redisService;
    @Autowired
    private AddFoodRecipeService recipeService;
    @Autowired
    private AddCocktailRecipeService cocktailRecipeService;


    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private MemberService memberService;

    @PostMapping("/save-recipe")
    public ResponseEntity<String> saveRecipe(Authentication authentication, @ModelAttribute AddFoodRecipeDto recipeRequest) {
        Long memberId = Long.parseLong(authentication.getName());
        String jsonData = recipeService.saveRecipe(memberId, recipeRequest);
        return ResponseEntity.ok(jsonData);
    }

    @PostMapping("/save-cocktail-recipe")
    public ResponseEntity<String> saveCocktailRecipe(Authentication authentication, @ModelAttribute AddCocktailRecipeDto recipeRequest) {
        Long memberId = Long.parseLong(authentication.getName());
        String jsonData = cocktailRecipeService.saveCocktailRecipe(memberId, recipeRequest);
        return ResponseEntity.ok(jsonData);
    }


    @PostMapping("/updateCount")
    public ResponseEntity<Boolean> updateRecipeCount(Authentication authentication,@RequestParam String action, // "likes" or "reports"
                                                     @RequestParam String postId,
                                                     @RequestParam String type,
                                                     @RequestParam boolean increase) {
        boolean isUpdated = redisService.updateRecipeCount(authentication,action, postId, type, increase);
        return ResponseEntity.ok(isUpdated);  // 성공 여부 (true/false) 반환
    }

}
