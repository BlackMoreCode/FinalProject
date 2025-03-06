package com.kh.back.service.python;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.back.dto.python.SearchListResDto;
import com.kh.back.dto.python.SearchResDto;
import com.kh.back.dto.recipe.res.CocktailIngListResDto;
import com.kh.back.dto.recipe.res.CocktailListResDto;
import com.kh.back.dto.recipe.res.CocktailResDto;
import com.kh.back.dto.recipe.res.FoodListResDto;
import com.kh.back.dto.recipe.res.FoodResDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ElasticService {

	private final RestTemplate restTemplate;
	private final String flaskBaseUrl = "http://localhost:5001";
	private final ObjectMapper objectMapper;

	/**
	 * [오버로드 메서드: 기존 칵테일 검색용]
	 * - 칵테일 로직처럼 '조리방법(cookingMethod)'이 필요 없는 경우를 위해
	 * - 예전 방식대로 5개 파라미터만 받는 메서드를 추가하여 하위 호환성을 유지
	 * - 내부적으로는 6개 파라미터를 받는 메서드를 호출하며, cookingMethod=""로 처리
	 *
	 * @param q        검색어 (빈 문자열이면 전체 검색)
	 * @param type     검색 타입 (예: "cocktail", "food")
	 * @param category 카테고리 (빈 문자열이면 필터 없음)
	 * @param page     페이지 번호
	 * @param size     페이지 당 항목 수
	 * @return 검색 결과 목록 (SearchListResDto)
	 */
	public List<SearchListResDto> search(String q, String type, String category, Integer page, Integer size) {
		// cookingMethod를 ""(빈 문자열)로 지정하여 6개짜리 메서드를 호출
		return search(q, type, category, "", page, size);
	}

	/**
	 * [신규 메서드: 음식 검색 포함]
	 * - 기존 칵테일 검색뿐만 아니라, 음식 검색 시 '조리방법(cookingMethod)' 필터도 가능
	 * - 호출부에서 cookingMethod가 필요 없는 경우에는 ""로 넘겨주면 됨
	 *
	 * @param q             검색어 (빈 문자열일 경우 전체 검색)
	 * @param type          검색 타입 (예: "cocktail", "food")
	 * @param category      카테고리 (예: "반찬", 없으면 "")
	 * @param cookingMethod 조리방법 (예: "찌기", 없으면 "")
	 * @param page          페이지 번호
	 * @param size          한 페이지 당 항목 수
	 * @return 검색 결과 목록 (SearchListResDto)
	 */
	public List<SearchListResDto> search(String q, String type, String category, String cookingMethod, Integer page, Integer size) {
		try {
			// UTF-8 인코딩 처리
			String encodedQuery = URLEncoder.encode(q, StandardCharsets.UTF_8);
			String encodedType = URLEncoder.encode(type, StandardCharsets.UTF_8);

			// category가 빈 문자열이 아니면 &category=... 파라미터로 추가
			String categoryParam = (category != null && !category.isEmpty())
					? "&category=" + URLEncoder.encode(category, StandardCharsets.UTF_8)
					: "";

			// cookingMethod가 빈 문자열이 아니면 &cookingMethod=... 파라미터로 추가
			String methodParam = (cookingMethod != null && !cookingMethod.isEmpty())
					? "&cookingMethod=" + URLEncoder.encode(cookingMethod, StandardCharsets.UTF_8)
					: "";

			// 최종적으로 호출할 URI 구성
			URI uri = new URI(flaskBaseUrl + "/search?q=" + encodedQuery
					+ "&type=" + encodedType
					+ categoryParam
					+ methodParam
					+ "&page=" + page
					+ "&size=" + size);

			// 로그 기록
			log.info("**[DEBUG]** search() about to call Flask with URI: {}", uri);
			log.info("**[DEBUG]** (q={}, type={}, category={}, cookingMethod={}, page={}, size={})",
					q, type, category, cookingMethod, page, size);

			// Flask 백엔드 호출
			ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
			log.warn("검색의 flask 응답 : {}", response);

			// 응답 JSON 문자열을 List<DTO>로 변환
			return convertResToList(response.getBody(), type);

		} catch (Exception e) {
			log.error("일반 검색중 에러 {}-{}-{}-{}-{} : {}", q, type, category, page, size, e.getMessage());
			return null;
		}
	}

	/**
	 * [상세 조회 메서드]
	 * - 기존과 동일한 로직
	 */
	public SearchResDto detail(String id, String type) {
		try {
			URI uri = new URI(flaskBaseUrl + "/detail/" + id + "?type=" + type);
			log.info("**[DEBUG]** detail() about to call Flask with URI: {}", uri);

			ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
			log.warn("상세정보의 flask 응답 : {}", response);
			return convertResToDto(response.getBody(), type);
		} catch (Exception e) {
			log.error("세부 사항 조회중 에러 {}-{} : {}", id, type, e.getMessage());
			return null;
		}
	}

	/**
	 * [검색 결과 변환 메서드]
	 * - JSON 응답 문자열을 List 형태로 변환
	 * - type이 "cocktail"이면 칵테일 전용 DTO,
	 *   type이 "food"이면 음식 전용 DTO로 매핑
	 */
	public List<SearchListResDto> convertResToList(String response, String type) throws IOException {
		switch (type) {
			case "cocktail":
				return objectMapper.readValue(response,
						objectMapper.getTypeFactory().constructCollectionType(List.class, CocktailListResDto.class));
			case "food":
				return objectMapper.readValue(response,
						objectMapper.getTypeFactory().constructCollectionType(List.class, FoodListResDto.class));
			case "cocktail_ingredient":
				return objectMapper.readValue(response,
						objectMapper.getTypeFactory().constructCollectionType(List.class, CocktailIngListResDto.class));
			case "food_ingredient":
				// 필요 시 FoodIngredient DTO 생성 후 사용 가능
				return null;
			case "feed":
				return null;
			default:
				return null;
		}
	}

	/**
	 * [상세 정보 변환 메서드]
	 * - JSON 응답 문자열을 DTO 형태로 변환
	 */
	public SearchResDto convertResToDto(String response, String type) throws IOException {
		switch (type) {
			case "cocktail":
				return objectMapper.readValue(response, CocktailResDto.class);
			case "food":
				return objectMapper.readValue(response, FoodResDto.class);
			case "feed":
				return null;
			default:
				return null;
		}
	}

	public String uploadRecipe(String jsonData) {
		try {
			// Flask 서버의 엔드포인트 URL
			URI uri = new URI(flaskBaseUrl + "/upload/one");

			// HTTP 요청 헤더 설정
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);

			// HTTP 요청 본문 설정
			HttpEntity<String> requestEntity = new HttpEntity<>(jsonData, headers);

			// Flask 서버로 POST 요청 전송
			ResponseEntity<String> response = restTemplate.postForEntity(uri, requestEntity, String.class);

			// 응답 로그 기록
			log.info("Flask 서버 응답: {}", response.getBody());

			return response.getBody();
		} catch (Exception e) {
			log.error("레시피 업로드 중 에러 발생: {}", e.getMessage());
			return null;
		}
	}


}
