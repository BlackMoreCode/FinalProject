package com.kh.back.controller.recipe;

import com.kh.back.dto.recipe.res.CocktailListResDto;
import com.kh.back.dto.recipe.res.CocktailResDto;
import com.kh.back.dto.recipe.res.FoodListResDto;
import com.kh.back.dto.recipe.res.FoodResDto;
import com.kh.back.service.recipe.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 통합 레시피 컨트롤러
 * - 음식 및 칵테일 레시피에 대한 검색, 상세 조회 API를 통합합니다.
 */
@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class RecipeController {

    private final RecipeService recipeService;

    /**
     * 레시피 검색 API
     * 예) GET /api/recipes/search?type=cocktail&q=모히또&category=롱드링크&page=1&size=10
     *     GET /api/recipes/search?type=food&q=김치&category=반찬&cookingMethod=찌기&page=1&size=10
     *
     * @param q             검색어 (없으면 빈 문자열)
     * @param type          레시피 타입 ("cocktail" 또는 "food")
     * @param category      카테고리 필터 (없으면 빈 문자열)
     * @param cookingMethod 조리방법 필터 (음식은 사용, 칵테일은 무시)
     * @param page          페이지 번호
     * @param size          한 페이지당 항목 수
     * @return 검색 결과 (레시피 목록)
     */
    @GetMapping("/search")
    public ResponseEntity<List<?>> searchRecipes(
            @RequestParam(name = "q", required = false, defaultValue = "") String q,
            @RequestParam String type,
            @RequestParam(required = false, defaultValue = "") String category,
            @RequestParam(required = false, defaultValue = "") String cookingMethod,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        // 칵테일 검색에서는 cookingMethod를 무시합니다.
        if ("cocktail".equalsIgnoreCase(type)) {
            cookingMethod = "";
        }
        List<?> result = recipeService.searchRecipes(q, type, category, cookingMethod, page, size);
        return ResponseEntity.ok(result);
    }

    /**
     * 레시피 상세 조회 API
     * 예) GET /api/recipes/{id}?type=food
     *
     * @param id   레시피 문서의 ID
     * @param type 레시피 타입 ("cocktail" 또는 "food")
     * @return 상세 레시피 데이터
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeDetail(
            @PathVariable String id,
            @RequestParam String type) {
        Object detail = recipeService.getRecipeDetail(id, type);
        return ResponseEntity.ok(detail);
    }
}
