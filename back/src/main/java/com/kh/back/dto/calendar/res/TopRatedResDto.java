package com.kh.back.dto.calendar.res;

import lombok.*;

@Getter @Setter @ToString
@AllArgsConstructor @NoArgsConstructor
public class TopRatedResDto {
	String recipeId;
	String img;
	String title;
	Long count;
	int rate;
}
