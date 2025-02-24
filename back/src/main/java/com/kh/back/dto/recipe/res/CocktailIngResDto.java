package com.kh.back.dto.recipe.res;

import lombok.*;

@Getter @Setter @ToString
@AllArgsConstructor @NoArgsConstructor
public class CocktailIngResDto {
	private String ingredient;
	private String unit;
	private double amount;
	private String special;
}
