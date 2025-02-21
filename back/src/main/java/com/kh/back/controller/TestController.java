package com.kh.back.controller;

import com.kh.back.service.redis.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

@Controller("/test")
@RequiredArgsConstructor
public class TestController {
	final private RedisService redisService;
	
	
	@PostMapping("/incr")
	public Long incr() {
		return redisService.incrementLikes("10");
	}
}
