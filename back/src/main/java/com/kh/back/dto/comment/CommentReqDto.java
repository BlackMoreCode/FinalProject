package com.kh.back.dto.comment;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class CommentReqDto {
    private String recipeId;
    private String content;
}
