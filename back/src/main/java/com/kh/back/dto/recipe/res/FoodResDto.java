package com.kh.back.dto.recipe.res;

import com.kh.back.dto.python.SearchResDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class FoodResDto implements SearchResDto {
    private String id;
    private String name;           // maps to RCP_NM
    private String description;    // maps to RCP_NA_TIP
    private String image;          // maps to ATT_FILE_NO_MAIN
    private String category;       // maps to RCP_PAT2
    private String cookingMethod;  // maps to RCP_WAY2
    private List<FoodIngResDto> ingredients;  // maps from RCP_PARTS_DTLS
    private List<FoodManualDto> instructions; // maps from MANUALS

    @Getter
    @Setter
    @ToString
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FoodManualDto {
        private String text;
        private String imageUrl;
    }
}
