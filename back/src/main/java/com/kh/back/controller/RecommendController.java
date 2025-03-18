package com.kh.back.controller;

import com.kh.back.service.PurchaseService;
import com.kh.back.service.member.CalendarService;
import com.kh.back.service.python.ElasticService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/recommend")
@RequiredArgsConstructor
public class RecommendController {
	private final RecommendService recommendService;
	
	
	
}
