package com.kh.back.dto.recipe.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ActionReqDto {
    private String action;
    private String postId;
    private String type;
    private boolean increase;
}
