package com.kh.back.dto.recipe.res;

import com.kh.back.dto.python.SearchResDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FoodDetailResDto implements SearchResDto {
    private String name;
    private String RCP_WAY2;
    private String RCP_PAT2;
    private String RCP_NA_TIP;
    private List<IngredientDto> ingredients;
    private List<ManualDto> manuals;
    private String ATT_FILE_NO_MAIN;
    private String ATT_FILE_NO_MK;
    private int like;
    private int report;
    private int author;

    public static class IngredientDto {
        private String ingredient;
        private String amount;


    }

    public static class ManualDto {
        private String text;
        private String imageUrl;


    }
}

