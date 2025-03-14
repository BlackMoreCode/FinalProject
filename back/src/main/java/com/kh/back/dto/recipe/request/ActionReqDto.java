package com.kh.back.dto.recipe.request;


import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor

public class ActionReqDto {
    private String action;
    private String postId;
    private String type;
    private boolean increase;
}
