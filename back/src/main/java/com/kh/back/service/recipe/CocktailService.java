package com.kh.back.service.recipe;

import com.kh.back.dto.python.SearchListResDto;
import com.kh.back.dto.python.SearchResDto;
import com.kh.back.dto.recipe.res.CocktailListResDto;
import com.kh.back.dto.recipe.res.CocktailResDto;
import com.kh.back.service.python.ElasticService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 칵테일 관련 비즈니스 로직 서비스
 * <p>ElasticService를 호출하여 Elasticsearch(Flask 서버)로부터 칵테일 데이터를 조회</p>
 */
@Service
@RequiredArgsConstructor
public class CocktailService {

    private final ElasticService elasticService;

    /**
     * 칵테일 검색 (카테고리 필터 포함)
     * @param q 검색어 (빈 문자열이면 전체)
     * @param category 카테고리 (null이면 전체)
     * @param page 페이지 번호
     * @param size 한 페이지 당 조회할 데이터 수
     * @return 칵테일 리스트 DTO 목록
     */
    public List<CocktailListResDto> searchCocktails(String q, String category, int page, int size) {
        List<SearchListResDto> rawList = elasticService.search(q, "cocktail", category, page, size);
        if (rawList == null) return Collections.emptyList();
        return rawList.stream()
                .map(item -> (CocktailListResDto) item)
                .collect(Collectors.toList());
    }

    /**
     * 칵테일 상세 조회
     * @param id 칵테일의 고유 ID
     * @return 칵테일 상세 DTO
     */
    public CocktailResDto getCocktailDetail(String id) {
        SearchResDto res = elasticService.detail(id, "cocktail");
        return (CocktailResDto) res;
    }
}
