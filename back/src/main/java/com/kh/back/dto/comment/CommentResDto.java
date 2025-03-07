package com.kh.back.dto.comment;

import com.kh.back.entity.Comment;
import com.kh.back.entity.member.Member;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class CommentResDto {

    private String nickName;
    private String content;
    private Long parentCommentId; // 부모 댓글 ID (대댓글 구별용)
    private boolean isReply; // 대댓글 여부
    private List<CommentResDto> replies; // 대댓글 리스트

    // Entity에서 DTO로 변환
    public static CommentResDto fromEntity(Comment comment) {
        List<CommentResDto> replies = comment.getReplies().stream()
                .map(CommentResDto::fromEntity)
                .toList(); // 대댓글을 리스트로 변환

        return new CommentResDto(
                comment.getMember().getNickName(),
                comment.getContent(),
                comment.getParentComment() != null ? comment.getParentComment().getCommentId() : null, // 부모 댓글이 있으면 그 ID
                comment.getParentComment() != null, // 부모 댓글이 있으면 대댓글로 처리
                replies
        );
    }
}
