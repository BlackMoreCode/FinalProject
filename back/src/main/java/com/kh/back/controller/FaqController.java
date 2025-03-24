package com.kh.back.controller;

import com.kh.back.dto.faq.request.FaqReqDto;
import com.kh.back.dto.faq.res.FaqResDto;
import com.kh.back.service.faq.FaqService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/faq")
@RequiredArgsConstructor
public class FaqController {
	
	private final FaqService faqService;
	
	// 검색 결과 요청 엔드포인트
	@GetMapping("/public/search")
	public ResponseEntity<List<FaqResDto>> searchFaq(@RequestParam("q") String keyword, @RequestParam("page") int page, @RequestParam("size") int size) {
		return ResponseEntity.ok(faqService.searchFaq(keyword, page, size));
	}
	
	// 전체 페이지 수 요청 엔드포인트
	@GetMapping("/public/page")
	public ResponseEntity<Integer> getTotalPages(@RequestParam("q") String keyword, @RequestParam("size") int size) {
		return ResponseEntity.ok(faqService.getTotalPages(keyword, size));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Boolean> deleteFaq(@PathVariable("id") String id, Authentication auth) {
		return ResponseEntity.ok(faqService.deleteFaq(id, auth));
	}
	
	@PostMapping("/{id}")
	public ResponseEntity<Boolean> updateFaq(@PathVariable("id") String id, @RequestBody FaqReqDto dto, Authentication auth) {
		return ResponseEntity.ok(faqService.updateFaq(id, dto, auth));
	}
}
