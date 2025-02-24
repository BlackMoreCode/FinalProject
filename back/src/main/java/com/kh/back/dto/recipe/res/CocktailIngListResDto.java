package com.kh.back.dto.recipe.res;

import com.kh.back.dto.python.SearchResDto;
import lombok.*;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class CocktailIngListResDto implements SearchResDto {
	String id;
	String name;
	float abv;
}
