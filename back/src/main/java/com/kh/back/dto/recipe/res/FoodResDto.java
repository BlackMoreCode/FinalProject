package com.kh.back.dto.recipe.res;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.back.dto.python.SearchResDto;
import lombok.*;

import java.util.List;

/**
 * 음식 레시피 상세 응답 DTO
 * - 입력 시 "RCP_NA_TIP", "ATT_FILE_NO_MAIN", "RCP_PAT2", "RCP_WAY2" 등으로 받아들이고,
 *   출력 시에는 각각 description, image, category, cookingMethod라는 키로 반환합니다.
 */
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class FoodResDto implements SearchResDto {
    private String id;

    private String name;

    @JsonProperty("description")
    @JsonAlias("RCP_NA_TIP")
    private String description;

    @JsonProperty("image")
    @JsonAlias("ATT_FILE_NO_MAIN")
    private String image;

    @JsonProperty("category")
    @JsonAlias("RCP_PAT2")
    private String category;

    @JsonProperty("cookingMethod")
    @JsonAlias("RCP_WAY2")
    private String cookingMethod;

    private List<FoodIngResDto> ingredients;

    private List<FoodManualDto> instructions;

    @Getter
    @Setter
    @ToString
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FoodManualDto {
        private String text;
        @JsonProperty("imageUrl")
        private String imageUrl;
    }
}
