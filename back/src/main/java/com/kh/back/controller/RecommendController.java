package com.kh.back.controller;

import com.kh.back.dto.recipe.res.RecommendResDto;
import com.kh.back.service.RecommendService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/recommend")
@RequiredArgsConstructor
public class RecommendController {
	private final RecommendService recommendService;
	
	@GetMapping("/public/{type}")
	public ResponseEntity<List<RecommendResDto>> getTop3Recommend(@PathVariable String type) {
		return ResponseEntity.ok(recommendService.recommend(null, type));
	}
	
	@GetMapping("/{type}")
	public ResponseEntity<List<RecommendResDto>> getTop3Recommend(@PathVariable String type, Authentication authentication) {
		return ResponseEntity.ok(recommendService.recommend(authentication, type));
	}
	
	
	
}
