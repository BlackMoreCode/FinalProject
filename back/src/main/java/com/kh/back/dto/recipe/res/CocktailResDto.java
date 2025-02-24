package com.kh.back.dto.recipe.res;

import com.kh.back.dto.python.SearchResDto;
import lombok.*;

import java.util.List;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class CocktailResDto implements SearchResDto {
	private String id;
	private String name;
	private String description;
	private String image;
	private String category;
	private float abv;
	private String garnish;
	List<CocktailIngResDto> ingredients;
}
