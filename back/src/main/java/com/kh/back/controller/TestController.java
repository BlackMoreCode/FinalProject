package com.kh.back.controller;

import com.kh.back.dto.python.SearchResDto;
import com.kh.back.service.python.ElasticService;
import com.kh.back.service.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/test")
public class TestController {
	final private RedisService redisService;
	final private ElasticService elasticService;
	
	@PostMapping("/incr")
	public Long incr() {
		return redisService.incrementLikes("0");
	}
	
	@GetMapping("/total")
	public Long total() {
		return redisService.getLikes("0");
	}
	
	@GetMapping("/search")
	public List<SearchResDto> search(@RequestParam String query, @RequestParam String type) {
		return elasticService.search(query, type, 1, 10);
	}
}
