package com.kh.back.dto.recipe.res;


import com.kh.back.dto.python.SearchResDto;
import lombok.*;

@Getter @Setter @ToString
@NoArgsConstructor
@AllArgsConstructor
public class CocktailListResDto implements SearchResDto {
	private String id;
	private String name;
	private Long like;
	private String category;
}
