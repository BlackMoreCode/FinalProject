package com.kh.back.controller.forum;

import com.kh.back.dto.forum.response.ForumCategoryDto;
import com.kh.back.service.forum.ForumCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * ForumCategoryController
 * <p>
 * KR: 포럼 카테고리 관련 REST API 엔드포인트를 정의합니다.
 */
@RestController
@RequestMapping("/api/forums/categories")
@RequiredArgsConstructor
@Slf4j
public class ForumCategoryController {

    private final ForumCategoryService categoryService;
    // KR: Flask 서비스와 통신하기 위한 RestTemplate을 의존성 주입 받습니다.
    private final RestTemplate restTemplate;

    /**
     * [전체 카테고리 조회 엔드포인트]
     * KR: ElasticSearch에 저장된 모든 포럼 카테고리 문서를 조회하여 반환합니다.
     *
     * @return 카테고리 목록 (List&lt;ForumCategoryDto&gt;)
     */
    @GetMapping
    public ResponseEntity<List<ForumCategoryDto>> getAllCategories() {
        log.info("모든 카테고리 조회 요청");
        List<ForumCategoryDto> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * [특정 카테고리 조회 엔드포인트]
     * KR: 카테고리 ID를 받아 해당 카테고리 문서를 조회합니다.
     *     문서가 존재하면 200 OK와 함께 반환하고, 없으면 404 Not Found를 반환합니다.
     *
     * @param id 카테고리 ID
     * @return ForumCategoryDto (존재 시) 또는 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<ForumCategoryDto> getCategoryWithLatestPost(@PathVariable String id) {
        log.info("카테고리 ID {} 조회 요청", id);
        return categoryService.getCategoryWithLatestPost(id)
                .map(ResponseEntity::ok)                    // Optional에 값이 있으면 200 OK
                .orElse(ResponseEntity.notFound().build()); // 값이 없으면 404 Not Found
    }

    /**
     * [Flask 포럼 카테고리 프록시 조회 엔드포인트]
     * KR: Spring Boot 백엔드가 Flask 서비스의 포럼 카테고리 데이터를 대신 호출하여 클라이언트에 반환합니다.
     *     이를 통해 프론트엔드는 단일 도메인(Spring Boot)에서 모든 데이터를 받아볼 수 있습니다.
     *     Flask의 포럼 카테고리 조회 엔드포인트 URL: http://localhost:5001/forum/category
     *
     * @return Flask에서 반환한 포럼 카테고리 JSON 문자열
     */
    @GetMapping("/proxy")
    public ResponseEntity<?> getCategoriesFromFlask() {
        log.info("Flask 포럼 카테고리 조회 프록시 요청");
        try {
            // KR: Flask 서비스의 포럼 카테고리 조회 URL 정의 (Flask는 포트 5001에서 실행됨)
            String flaskUrl = "http://localhost:5001/forum/category";
            // KR: RestTemplate을 사용하여 Flask 서비스에 GET 요청 전송
            ResponseEntity<String> flaskResponse = restTemplate.getForEntity(flaskUrl, String.class);
            if (flaskResponse.getStatusCode().is2xxSuccessful()) {
                log.info("Flask 포럼 카테고리 조회 성공, 응답: {}", flaskResponse.getBody());
                // KR: Flask가 반환한 JSON 데이터를 그대로 클라이언트에 반환
                return ResponseEntity.ok(flaskResponse.getBody());
            } else {
                log.error("Flask 포럼 카테고리 조회 실패, 상태: {}", flaskResponse.getStatusCode());
                return ResponseEntity.status(flaskResponse.getStatusCode()).body(flaskResponse.getBody());
            }
        } catch (Exception e) {
            log.error("Flask 포럼 카테고리 조회 중 예외 발생: {}", e.getMessage());
            return ResponseEntity.status(500).body("Flask 포럼 카테고리 조회 중 오류 발생: " + e.getMessage());
        }
    }
}
