package com.kh.back.service.recipe;

import com.kh.back.dto.python.SearchListResDto;
import com.kh.back.dto.python.SearchResDto;
import com.kh.back.dto.recipe.res.FoodListResDto;
import com.kh.back.dto.recipe.res.FoodResDto;
import com.kh.back.service.python.ElasticService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodService {

    private final ElasticService elasticService;

    /**
     * 음식 레시피 검색
     *
     * @param q             검색어 (빈 문자열이면 전체 검색)
     * @param category      카테고리 필터 (빈 문자열이면 필터 해제)
     * @param cookingMethod 조리방법 필터 (빈 문자열이면 필터 해제)
     * @param page          페이지 번호
     * @param size          페이지 당 항목 수
     * @return FoodListResDto 목록
     */
    public List<FoodListResDto> searchFoodRecipes(String q, String category, String cookingMethod, int page, int size) {
        // Flask(Elasticsearch) 쪽에 type="food"와 함께 category, cookingMethod 필터를 전달
        List<SearchListResDto> rawList = elasticService.search(q, "food", category, cookingMethod, page, size);
        if (rawList == null) {
            return Collections.emptyList();
        }
        // SearchListResDto를 FoodListResDto로 캐스팅하여 반환
        return rawList.stream()
                .map(item -> (FoodListResDto) item)
                .collect(Collectors.toList());
    }

    /**
     * 음식 레시피 상세 조회
     *
     * @param id 음식 레시피 문서의 ID
     * @return FoodResDto
     */
    public FoodResDto getFoodRecipeDetail(String id) {
        SearchResDto res = elasticService.detail(id, "food");
        return (FoodResDto) res;
    }
}
