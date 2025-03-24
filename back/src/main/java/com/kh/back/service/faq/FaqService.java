package com.kh.back.service.faq;

import com.kh.back.constant.Authority;
import com.kh.back.dto.faq.request.FaqReqDto;
import com.kh.back.dto.faq.res.FaqResDto;
import com.kh.back.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FaqService {
	private final RestTemplate restTemplate;
	private final String BASE_URL = "http://localhost:5001";  // Flask 서버 URL
	private final MemberService memberService;
	
	// 검색 결과 요청
	public List<FaqResDto> searchFaq(String keyword, int page, int size) {
		String url = BASE_URL + "/search/faq";
		
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(url)
			.queryParam("q", keyword)
			.queryParam("page", page)
			.queryParam("size", size);
		
		try {
			// GET 요청을 보내고 응답 받기
			ResponseEntity<Map> response = restTemplate.getForEntity(uriBuilder.toUriString(), Map.class);
			
			// 응답에서 "results" 필드 추출
			List<Map<String, String>> results = (List<Map<String, String>>) response.getBody().get("results");
			
			// 결과를 DTO로 변환하여 반환
			return results.stream()
				.map(result -> new FaqResDto(result.get("id"), result.get("title"), result.get("content")))
				.collect(Collectors.toList());
		} catch (Exception e) {
			log.error("검색 중 오류 발생: {}", e.getMessage());
			return List.of();  // 빈 리스트 반환
		}
	}
	
	// 전체 페이지 수 요청
	public int getTotalPages(String keyword, int size) {
		String url = BASE_URL + "/total/page";
		
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(url)
			.queryParam("q", keyword)
			.queryParam("size", size);
		
		try {
			// GET 요청을 보내고 응답 받기
			ResponseEntity<Map> response = restTemplate.getForEntity(uriBuilder.toUriString(), Map.class);
			
			// 전체 페이지 수 받아오기
			return (int) response.getBody().get("total_page");
		} catch (Exception e) {
			log.error("전체 페이지 수 조회 중 오류 발생: {}", e.getMessage());
			return 0;  // 오류가 발생하면 0 반환
		}
	}
	public boolean deleteFaq(String faqId, Authentication auth) {
		String url = BASE_URL + "/faq/" + faqId;
		
		if(!memberService.convertAuthToEntity(auth).getAuthority().equals(Authority.ROLE_ADMIN)) {
			log.error("관리자가 아닌 사용자가 FAQ를 삭제하려고 했습니다. : {}- {}", faqId, auth );
			return false;
		}
		
		try {
			ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.DELETE, null, Map.class);
			
			if (response.getStatusCode() == HttpStatus.OK) {
				return (boolean) response.getBody().get("success");
			}
		} catch (Exception e) {
			log.error("FAQ 삭제 중 오류 발생: {}", e.getMessage());
		}
		
		return false; // 삭제 실패 시 false 반환
	}
	
	// FAQ 수정 요청
	public boolean updateFaq(String faqId, FaqReqDto dto, Authentication auth) {
		String url = BASE_URL + "/faq/" + faqId;
		
		if(!memberService.convertAuthToEntity(auth).getAuthority().equals(Authority.ROLE_ADMIN)) {
			log.error("관리자가 아닌 사용자가 FAQ를 수정하려고 했습니다. : {}- {}", faqId, auth );
			return false;
		}
		
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		
		HttpEntity<FaqReqDto> requestEntity = new HttpEntity<>(dto, headers);
		
		try {
			ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.PUT, requestEntity, Map.class);
			
			if (response.getStatusCode() == HttpStatus.OK) {
				return (boolean) response.getBody().get("success");
			}
		} catch (Exception e) {
			log.error("FAQ 수정 중 오류 발생: {}", e.getMessage());
		}
		
		return false; // 수정 실패 시 false 반환
	}
}
