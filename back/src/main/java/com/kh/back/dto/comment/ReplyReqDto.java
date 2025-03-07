package com.kh.back.dto.comment;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class ReplyReqDto {
    private Long parentCommentId;  // 부모 댓글 ID
    private String content;        // 대댓글 내용
}
