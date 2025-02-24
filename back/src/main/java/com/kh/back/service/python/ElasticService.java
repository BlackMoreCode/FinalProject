package com.kh.back.service.python;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.back.dto.python.SearchResDto;
import com.kh.back.dto.recipe.res.CocktailListResDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ElasticService {
	private final RestTemplate restTemplate;
	private final String flaskBaseUrl = "http://localhost:5000";
	private final ObjectMapper objectMapper;
	
	public String search(String query, String type, Integer page, Integer size) {
		UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(flaskBaseUrl)
			.queryParam("q", query)
			.queryParam("type", type)
			.queryParam("page", page)
			.queryParam("size", size);
		
		ResponseEntity<String> response = restTemplate.getForEntity(uriBuilder.toUriString(), String.class);
		
		return response.getBody();
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	public List<SearchResDto> convertResToCocktailList(String response, String type) throws IOException {
		switch (type) {
			case "cocktail":
				return objectMapper.readValue(response,objectMapper.getTypeFactory().constructCollectionType(List.class, CocktailListResDto.class));
			case "food":
				return null;
			default:
				return null;
		}
	}
}
