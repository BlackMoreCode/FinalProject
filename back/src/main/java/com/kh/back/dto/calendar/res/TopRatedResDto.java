package com.kh.back.dto.calendar.res;

import lombok.*;

@Getter @Setter @ToString
@AllArgsConstructor @NoArgsConstructor
public class TopRatedResDto {
	String recipeId;
	Long count;
	int rate;
}
