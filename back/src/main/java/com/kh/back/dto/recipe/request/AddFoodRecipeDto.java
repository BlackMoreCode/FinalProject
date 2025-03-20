package com.kh.back.dto.recipe.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class AddFoodRecipeDto {
    private String postId;
    private String type;
    private String name;
    private String rcpWay2;
    private String rcpPat2;
    private String infoWgt;
    private MultipartFile attFileNoMain; // 새로 추가한 메인 이미지 파일
    private String existingMainImageUrl; // 기존 메인 이미지 URL

    private String rcpNaTip;
    private List<Ingredients> Ingredients;
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
        private MultipartFile newImageFile; // 새로 추가한 조리법 이미지 파일
        private String existingImageUrl; // 기존 조리법 이미지 URL
    }
}