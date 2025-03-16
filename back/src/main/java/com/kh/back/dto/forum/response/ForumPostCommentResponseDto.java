package com.kh.back.dto.forum.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

/**
 * 댓글 응답 DTO
 * KR: 클라이언트에 댓글 정보와 콘텐츠(HTML, JSON)를 전달하는 DTO.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ForumPostCommentResponseDto {
    private Integer id;             // 댓글 ID
    private String content;         // 댓글 내용 (HTML)
    private String authorName;      // 작성자 이름
    private Long memberId;          // 댓글 작성자 ID
    private Integer likesCount;     // 좋아요 수
    private Boolean hidden;         // 숨김 여부
    private String removedBy;       // 삭제자 정보
    private String editedBy;        // 수정자 정보
    private Boolean locked;         // 편집 잠금 상태
    // 생성 및 수정 시간을 OffsetDateTime으로 변경
    private OffsetDateTime createdAt;  // 생성 시간
    private OffsetDateTime updatedAt;  // 수정 시간
    private String fileUrl;         // 첨부 파일 URL
    private Long reportCount;       // 누적 신고 횟수
    private Boolean hasReported;    // 신고 여부

    private Integer postId;         // ← 댓글이 속한 게시글 ID

    // 추가 필드: 부모 댓글 정보 (답글 시)
    private Long parentCommentId;  // 부모 댓글 ID
    private String parentContent;     // 부모 댓글 내용

    // 추가 필드: OP 관련 정보 (인용 시)
    private String opAuthorName;      // OP 작성자 이름
    private String opContent;         // OP 내용

    /**
     * 댓글 콘텐츠의 JSON 표현 (Tiptap JSON)
     * KR: Tiptap 에디터의 JSON 형태 콘텐츠를 클라이언트에 전달하기 위한 필드
     */
    private String contentJSON;

    // Derived field: 관리자 수정 여부
    public Boolean getEditedByAdmin() {
        return "ADMIN".equals(this.editedBy);
    }
}
