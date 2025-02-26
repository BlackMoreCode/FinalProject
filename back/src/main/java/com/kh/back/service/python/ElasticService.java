package com.kh.back.service.python;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.back.dto.python.SearchListResDto;
import com.kh.back.dto.python.SearchResDto;
import com.kh.back.dto.recipe.res.CocktailIngListResDto;
import com.kh.back.dto.recipe.res.CocktailListResDto;
import com.kh.back.dto.recipe.res.CocktailResDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
	 * 칵테일 검색 메서드 (카테고리 필터 추가)
	 * @param q 검색어 (빈 문자열일 경우 전체 검색)
	 * @param type 검색 타입 (예: "cocktail")
	 * @param category 카테고리 (예: "식전 칵테일", 없으면 "")
	 * @param page 페이지 번호
	 * @param size 한 페이지 당 항목 수
	 * @return 검색 결과 목록 (SearchListResDto)
	 *
	 * <pre>
	 * 변경 이유:
	 *  - 기존에는 query와 type만으로 검색했으나, 카테고리 필터가 필요해짐
	 *  - Flask의 /search 엔드포인트에서는 검색어를 "q" 파라미터로 받아들이므로,
	 *    프론트엔드와 컨트롤러에서 전달받은 "q" 값을 그대로 사용.
	 *  - q가 빈 문자열이고 category가 있으면 해당 카테고리만 필터
	 *  - q와 category 모두 있으면 두 조건을 AND 처리
	 * </pre>
	 */
	public List<SearchListResDto> search(String q, String type, String category, Integer page, Integer size) {
		try {
			// UTF-8 인코딩 처리
			String encodedQuery = URLEncoder.encode(q, StandardCharsets.UTF_8);
			String encodedType = URLEncoder.encode(type, StandardCharsets.UTF_8);
			String categoryParam = (category != null && !category.isEmpty())
					? "&category=" + URLEncoder.encode(category, StandardCharsets.UTF_8)
					: "";

			// 최종적으로 호출할 URI 구성
			URI uri = new URI(flaskBaseUrl + "/search?q=" + encodedQuery
					+ "&type=" + encodedType
					+ categoryParam
					+ "&page=" + page
					+ "&size=" + size);

			// ADD LOGS HERE (before calling Flask)
			log.info("**[DEBUG]** search() about to call Flask with URI: {}", uri);
			log.info("**[DEBUG]** (q={}, type={}, category={}, page={}, size={})", q, type, category, page, size);

			// Flask 백엔드 호출
			ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);

			// ADD LOGS HERE (after receiving response)
			log.warn("검색의 flask 응답 : {}", response);

			return convertResToList(response.getBody(), type);

		} catch (Exception e) {
			log.error("일반 검색중 에러 {}-{}-{}-{} : {}", q, type, page, size, e.getMessage());
			return null;
		}
	}

	/**
	 * 칵테일 상세 조회
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

	public List<SearchListResDto> convertResToList(String response, String type) throws IOException {
		switch (type) {
			case "cocktail":
				return objectMapper.readValue(response,
						objectMapper.getTypeFactory().constructCollectionType(List.class, CocktailListResDto.class));
			case "food":
				return null;
			case "cocktail_ingredient":
				return objectMapper.readValue(response,
						objectMapper.getTypeFactory().constructCollectionType(List.class, CocktailIngListResDto.class));
			case "food_ingredient":
				return null;
			case "feed":
				return null;
			default:
				return null;
		}
	}

	public SearchResDto convertResToDto(String response, String type) throws IOException {
		switch (type) {
			case "cocktail":
				return objectMapper.readValue(response, CocktailResDto.class);
			case "food":
				return null;
			case "feed":
				return null;
			default:
				return null;
		}
	}
}
