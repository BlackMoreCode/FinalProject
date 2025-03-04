package com.kh.back.controller.recipe;

import com.kh.back.dto.recipe.res.FoodListResDto;
import com.kh.back.dto.recipe.res.FoodResDto;
import com.kh.back.service.recipe.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 음식 레시피 관련 API
 * Elasticsearch(Flask)에서 음식 레시피 데이터를 조회
 */
@RestController
@RequestMapping("/api/foodrecipes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FoodController {

    private final FoodService foodService;

    /**
     * 음식 레시피 검색 API
     * 검색어(q), 카테고리(category)와 함께 조리방법(cookingMethod) 필터도 전달할 수 있음.
     * 예) GET /api/foodrecipes/search?q=김치&category=반찬&cookingMethod=&page=1&size=10
     *
     * @param q             검색어 (없으면 빈 문자열로 처리)
     * @param category      카테고리 필터 (예: 반찬, 국&찌개, 후식 등; 없으면 빈 문자열)
     * @param cookingMethod 조리방법 필터 (예: 찌기, 끓이기, 굽기 등; 없으면 빈 문자열)
     * @param page          페이지 번호
     * @param size          페이지 당 항목 수
     * @return FoodListResDto 목록
     */
    @GetMapping("/search")
    public ResponseEntity<List<FoodListResDto>> searchFoodRecipes(
            @RequestParam(name = "q", required = false, defaultValue = "") String q,
            @RequestParam(required = false, defaultValue = "") String category,
            @RequestParam(required = false, defaultValue = "") String cookingMethod, // 조리방법 필터 추가
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        // FoodService에서 두 가지 필터 값을 모두 전달받아 검색 수행
        List<FoodListResDto> result = foodService.searchFoodRecipes(q, category, cookingMethod, page, size);
        return ResponseEntity.ok(result);
    }

    /**
     * 음식 레시피 상세 조회
     * 예) GET /api/foodrecipes/{id}
     *
     * @param id 음식 레시피 문서의 고유 ID
     * @return FoodResDto
     */
    @GetMapping("/{id}")
    public ResponseEntity<FoodResDto> getFoodRecipeDetail(@PathVariable String id) {
        FoodResDto detail = foodService.getFoodRecipeDetail(id);
        return ResponseEntity.ok(detail);
    }
}
