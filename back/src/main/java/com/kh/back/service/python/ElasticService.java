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
	
	public List<SearchListResDto> search(String query, String type, Integer page, Integer size) {
		try {
			// 수동으로 UTF-8 인코딩 후 직접 URI 구성
			String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
			String encodedType = URLEncoder.encode(type, StandardCharsets.UTF_8);
			// UriComponentsBuilder 사용 시 인코딩 방지
			URI uri = new URI(flaskBaseUrl + "/search?q=" + encodedQuery + "&type=" + encodedType + "&page=" + page + "&size=" + size);
			ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
			log.warn("검색의 flask 응답 :  {}", response);
			return convertResToList(response.getBody(), type);
		} catch (Exception e) {
			log.error("일반 검색중 에러 {}-{}-{}-{} : {}", query, type, page, size, e.getMessage());
			return null;
		}
	}
	public SearchResDto detail(String id, String type) {
		try{
			URI uri = new URI(flaskBaseUrl + "/detail/" + id + "?type=" + type);
			ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
			log.warn("상세정보의 flask 응답 : {}", response);
			return convertResToDto(response.getBody(), type);
		} catch (Exception e){
			log.error("세부 사항 조회중 에러 {}-{} : {}", id, type, e.getMessage());
			return null;
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	public List<SearchListResDto> convertResToList(String response, String type) throws IOException {
		switch (type) {
			case "cocktail":
				return objectMapper.readValue(response, objectMapper.getTypeFactory().constructCollectionType(List.class, CocktailListResDto.class));
			case "food":
				return null;
			case "cocktail_ingredient":
				return objectMapper.readValue(response, objectMapper.getTypeFactory().constructCollectionType(List.class, CocktailIngListResDto.class));
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
