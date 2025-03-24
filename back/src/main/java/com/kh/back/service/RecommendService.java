package com.kh.back.service;

import com.kh.back.constant.Action;
import com.kh.back.dto.calendar.res.TopRatedResDto;
import com.kh.back.dto.recipe.res.RecommendResDto;
import com.kh.back.entity.Reaction;
import com.kh.back.entity.member.Member;
import com.kh.back.repository.ReactionRepository;
import com.kh.back.service.member.CalendarService;
import com.kh.back.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class RecommendService {
	private final CalendarService calendarService;
	private final MemberService memberService;
	private final ReactionRepository reactionRepository;
	
	/**
	 * 추천 레시피 반환
	 */
	public List<RecommendResDto> recommend(Authentication auth, String type) {
		try {
			Member member = getMemberFromAuth(auth);
			List<String> idList = new ArrayList<>();
			
			// 1. 로그인 여부 확인 및 사용자가 좋아요한 레시피 가져오기
			if (member != null) {
				List<String> reactionIds = getUserLikedPostIds(member);
				if (!reactionIds.isEmpty()) {
					idList = fetchRecommendedIdsFromPython(reactionIds, type);
				}
			}
			
			// 2. idList가 비어 있으면 TopRated 레시피 사용
			if (idList.isEmpty()) {
				idList = fetchTopRatedRecipeIds(type);
			}
			
			// 3. 추천된 ID 리스트를 기반으로 RecommendResDto 가져오기
			return fetchRecommendResDto(idList, type);
		} catch (Exception e) {
			log.error("추천 리스트를 받아오는 중 오류 : {}", e.getMessage());
			return new ArrayList<>();
		}
	}
	
	/**
	 * 인증 정보를 바탕으로 회원 정보 가져오기
	 */
	private Member getMemberFromAuth(Authentication auth) {
		return (auth != null) ? memberService.convertAuthToEntity(auth) : null;
	}
	
	/**
	 * 사용자가 좋아요한 레시피 ID 가져오기
	 */
	private List<String> getUserLikedPostIds(Member member) {
		List<Reaction> reactions = reactionRepository.findByMemberAndAction(member, Action.likes);
		return reactions.stream()
			.map(Reaction::getPostId)
			.collect(Collectors.toList());
	}
	
	/**
	 * 좋아요한 레시피 ID 기반 추천 ID 가져오기 (Python API 호출)
	 */
	private List<String> fetchRecommendedIdsFromPython(List<String> reactionIds, String type) {
		String pythonApiUrl = "http://localhost:5001/check";
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		
		Map<String, Object> requestBody = new HashMap<>();
		requestBody.put("ids", reactionIds);
		requestBody.put("index", type);
		
		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
		RestTemplate restTemplate = new RestTemplate();
		
		// 응답을 Map<String, Object>로 받기
		ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
			pythonApiUrl,
			HttpMethod.POST,
			entity,
			new ParameterizedTypeReference<Map<String, Object>>() {}
		);
		
		// 응답에서 valid_ids를 추출하고 List<String>으로 반환
		Map<String, Object> responseBody = response.getBody();
		if (responseBody != null && responseBody.containsKey("valid_ids")) {
			List<String> validIds = (List<String>) responseBody.get("valid_ids");
			return validIds != null ? validIds : new ArrayList<>();
		}
		
		return new ArrayList<>();
	}
	
	
	/**
	 * TopRated 레시피의 ID 가져오기
	 */
	private List<String> fetchTopRatedRecipeIds(String type) {
		List<TopRatedResDto> topRatedResDtoList = calendarService.getTop3RecipeByIndex(type);
		return topRatedResDtoList.stream()
			.map(TopRatedResDto::getRecipeId)
			.collect(Collectors.toList());
	}
	
	/**
	 * 추천된 ID 리스트를 기반으로 RecommendResDto 가져오기 (Python API 호출)
	 */
	private List<RecommendResDto> fetchRecommendResDto(List<String> idList, String type) {
		if (idList.isEmpty()) {
			return new ArrayList<>();
		}
		
		String pythonApiUrl = "http://localhost:5001/batch/detail";
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		
		Map<String, Object> requestBody = new HashMap<>();
		requestBody.put("ids", idList);
		requestBody.put("type", type);
		
		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<List<RecommendResDto>> response = restTemplate.exchange(
			pythonApiUrl,
			HttpMethod.POST,
			entity,
			new ParameterizedTypeReference<List<RecommendResDto>>() {}
		);
		
		return response.getBody() != null ? response.getBody() : new ArrayList<>();
	}
}
