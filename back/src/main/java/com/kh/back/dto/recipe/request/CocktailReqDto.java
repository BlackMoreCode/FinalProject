package com.kh.back.dto.recipe.request;

import lombok.*;

/**
 * 칵테일 생성/수정 요청 DTO
 * <p>클라이언트에서 전달한 칵테일 정보를 담는 객체</p>
 */
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CocktailReqDto {
    private String name;
    private float abv;
    private String category;
    private String description;
    private String image;
    private Long like;
    private Long report;
}
