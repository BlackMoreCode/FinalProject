package com.kh.back.dto.calendar.res;

import lombok.*;

@Getter @Setter @ToString
@AllArgsConstructor @NoArgsConstructor
public class TopRatedResDto {
	String recipeId;
	String Img;
	String Title;
	Long count;
	int rate;
}
