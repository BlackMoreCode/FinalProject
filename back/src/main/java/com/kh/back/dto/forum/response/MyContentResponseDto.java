package com.kh.back.dto.forum.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyContentResponseDto {
    private List<ForumPostResponseDto> posts;
    private List<ForumPostCommentResponseDto> comments;
}