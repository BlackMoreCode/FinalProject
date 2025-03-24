package com.kh.back.dto.recipe.res;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class RecommendResDto {
	private String id;
	private String image;
	private String name;
	private int like;
}
