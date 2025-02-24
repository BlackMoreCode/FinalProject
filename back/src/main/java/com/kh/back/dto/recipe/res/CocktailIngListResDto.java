package com.kh.back.dto.recipe.res;

import com.kh.back.dto.python.SearchListResDto;
import lombok.*;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class CocktailIngListResDto implements SearchListResDto {
	String id;
	String name;
	float abv;
}
