package com.kh.back.dto.forum.request;

import lombok.Getter;
import lombok.Setter;

/**
 * 댓글 신고 요청 DTO
 * 댓글 신고에는 reporterId, reason, 그리고 신고 대상 댓글이 속한 게시글의 postId가 필요합니다.
 */
@Getter
@Setter
public class CommentReportRequestDto {
    private Integer reporterId;
    private String reason;
    private String postId;
}