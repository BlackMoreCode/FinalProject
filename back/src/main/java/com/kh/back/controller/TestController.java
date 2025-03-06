package com.kh.back.controller;

import com.kh.back.dto.python.SearchListResDto;
import com.kh.back.dto.python.SearchResDto;
import com.kh.back.service.python.ElasticService;
import com.kh.back.service.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/test")
public class TestController {

	private final RedisService redisService;
	private final ElasticService elasticService;

	@PostMapping("/incr")
	public Long incr() {
		return redisService.incrementLikes("0");
	}

	@GetMapping("/total")
	public Long total() {
		return redisService.getLikes("0");
	}

	/**
	 * 일반 검색 (카테고리 필터 포함)
	 * ex) GET /test/search?q=모히또&type=cocktail&category=롱드링크&page=1&size=10
	 *
	 * 변경 이유:
	 * - 기존에는 'query' 파라미터를 요구하여 빈 검색 시 오류가 발생하였음.
	 * - 이제 모든 검색어 관련 파라미터를 "q"로 통일하여, 클라이언트가 "q"를 전달하도록 함.
	 * - required=false 및 defaultValue=""를 지정하여, 파라미터가 없을 경우 빈 문자열로 처리함.
	 */
	@GetMapping("/search")
	public ResponseEntity<List<SearchListResDto>> search(
			@RequestParam(name = "q", required = false, defaultValue = "") String q,
			@RequestParam String type,
			@RequestParam(required = false, defaultValue = "") String category,
			@RequestParam(defaultValue = "1") int page,
			@RequestParam(defaultValue = "10") int size
	) {
		return ResponseEntity.ok(
				elasticService.search(q, type, category, null, page, size)
		);
	}

	/**
	 * 상세 조회
	 * ex) GET /test/detail/{id}?type=cocktail
	 */
	@GetMapping("/detail/{id}")
	public ResponseEntity<SearchResDto> detail(
			@PathVariable String id,
			@RequestParam String type
	) {
		return ResponseEntity.ok(elasticService.detail(id, type));
	}
}
