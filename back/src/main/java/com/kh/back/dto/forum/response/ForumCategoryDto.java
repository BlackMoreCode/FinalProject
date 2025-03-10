package com.kh.back.dto.forum.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

/**
 * ForumCategoryDto
 * 포럼 카테고리 정보를 클라이언트로 전달하기 위한 DTO 클래스
 */
@Data
@AllArgsConstructor
public class ForumCategoryDto {
    private String id; // 카테고리 ID (변경: Integer -> String)
    private String title; // 카테고리 제목
    private String description; // 카테고리 설명
    private int postCount; // 카테고리의 게시글 수
    private int commentCount; // 카테고리 내 댓글 수
    // 수정 시간을 OffsetDateTime으로 변경하여 타임존 정보 포함
    private OffsetDateTime updatedAt; // 카테고리 최종 수정 시간

    // 추가 필드: 최신 게시글 정보
    private String latestPostTitle; // 최신 게시글 제목
    private String latestPostAuthor; // 최신 게시글 작성자 이름
    private OffsetDateTime latestPostCreatedAt; // 최신 게시글 작성 시간
}
