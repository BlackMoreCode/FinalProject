package com.kh.back.service;


import com.kh.back.constant.Action;
import com.kh.back.dto.python.SearchListResDto;
import com.kh.back.entity.Reaction;
import com.kh.back.entity.member.Member;
import com.kh.back.repository.ReactionRepository;
import com.kh.back.service.member.CalendarService;
import com.kh.back.service.member.MemberService;
import com.kh.back.service.python.ElasticService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class RecommendService {
	private final ElasticService elasticService;
	private final CalendarService calendarService;
	private final MemberService memberService;
	private final ReactionRepository reactionRepository;
	private final RestTemplate restTemplate;
	
	
//	public List<SearchListResDto> recommend(Authentication auth, String type) {
//		Member member = memberService.convertAuthToEntity(auth);
//		List<Reaction> reactions = reactionRepository.findByMemberAndAction(member, Action.likes);
//		List<String> reactionIds = new ArrayList<>();
//		for (Reaction reaction : reactions) {
//			reactionIds.add(reaction.getPostId());
//		}
//		// Python API 호출
//		String pythonApiUrl = "http://localhost:5001/model/predict";
//		HttpHeaders headers = new HttpHeaders();
//		headers.setContentType(MediaType.APPLICATION_JSON);
//		Map<String, Object> requestBody = new HashMap<>();
//		requestBody.put("reaction_ids", reactionIds);  // reactionIds를 요청 본문에 추가
//		requestBody.put("type", type);  // 예시로 type 추가
//
//		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
//		ResponseEntity<Map> response = restTemplate.exchange(pythonApiUrl, HttpMethod.POST, entity, Map.class);
//
//
//		// 응답에서 추천 리스트를 가져오기
//		List<Map<String, Integer>> recommendedList = response.getBody().get("recommendation");
//	}
//
	
	
}
