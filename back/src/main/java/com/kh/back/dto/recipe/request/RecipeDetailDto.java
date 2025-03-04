package com.kh.back.dto.recipe.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class RecipeDetailDto {
    private String type;
    private String name;
    private String rcpWay2;
    private String rcpPat2;
    private String infoWgt;
    private MultipartFile attFileNoMain; // 대표 이미지 파일 (소)
    private MultipartFile attFileNoMk; // 대표 이미지 파일 (대)
    private String rcpNaTip;
    private List<Ingredients> rcpPartsDtls;
    private List<Manual> manuals;
    private Long authory;

    @Data
    public static class Ingredients {
        private String ingredient;
        private String amount;
    }

    @Data
    public static class Manual {
        private String text;
        private MultipartFile imageUrl; // 조리법 이미지 파일
    }
}