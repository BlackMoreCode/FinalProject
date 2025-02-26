package com.kh.back.controller.recipe;

import com.kh.back.dto.recipe.res.CocktailListResDto;
import com.kh.back.dto.recipe.res.CocktailResDto;
import com.kh.back.service.recipe.CocktailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 칵테일 관련 API
 * <p>Elasticsearch(Flask)에서 데이터 조회</p>
 */
@RestController
@RequestMapping("/api/cocktails")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CocktailController {

    private final CocktailService cocktailService;

    /**
     * 칵테일 검색
     * ex) GET /api/cocktails/search?q=모히또&category=롱드링크&page=1&size=10
     *
     * 변경 이유:
     * - 클라이언트로부터 검색어를 "q" 파라미터로 받아들임으로써, 서비스와 ElasticService와 일관되게 사용
     */
    @GetMapping("/search")
    public ResponseEntity<List<CocktailListResDto>> searchCocktails(
            @RequestParam(name = "q", required = false, defaultValue = "") String q,
            @RequestParam(required = false, defaultValue = "") String category,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        List<CocktailListResDto> result = cocktailService.searchCocktails(q, category, page, size);
        return ResponseEntity.ok(result);
    }

    /**
     * 칵테일 상세 조회
     * ex) GET /api/cocktails/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<CocktailResDto> getCocktailDetail(@PathVariable String id) {
        CocktailResDto detail = cocktailService.getCocktailDetail(id);
        return ResponseEntity.ok(detail);
    }
}
