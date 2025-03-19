package com.kh.back.controller.forum;

import com.kh.back.dto.forum.response.ForumPostResponseDto;
import com.kh.back.dto.forum.response.ForumPostCommentResponseDto;
import com.kh.back.dto.forum.response.MyContentResponseDto;
import com.kh.back.service.forum.ForumPostService;
import com.kh.back.service.forum.ForumPostCommentService;
import com.kh.back.service.python.ForumEsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forums/my")
@RequiredArgsConstructor
@Slf4j
public class ForumMyContentController {

    private final ForumPostService forumPostService;
    private final ForumPostCommentService forumPostCommentService;
    private final ForumEsService forumEsService;

//    /**
//     * GET /api/forums/my?memberId={memberId}&postPage=0&postSize=10&commentPage=0&commentSize=10
//     * 현재 유저가 작성한 게시글과 댓글을 함께 조회합니다.
//     */
//    @GetMapping
//    public ResponseEntity<MyContentResponseDto> getMyContent(
//            @RequestParam Long memberId,
//            @RequestParam(defaultValue = "0") int postPage,
//            @RequestParam(defaultValue = "10") int postSize,
//            @RequestParam(defaultValue = "0") int commentPage,
//            @RequestParam(defaultValue = "10") int commentSize
//    ) {
//        log.info("memberId {}의 전체 콘텐츠 조회 요청", memberId);
//        MyContentResponseDto result = forumEsService.getMyContent(memberId, postPage, postSize, commentPage, commentSize);
//        return ResponseEntity.ok(result);
//    }

    /**
     * 회원이 작성한 게시글만 조회하는 엔드포인트
     * 예: GET /api/forums/my/posts?memberId=66&page=0&size=10
     */
    @GetMapping("/posts")
    public ResponseEntity<List<ForumPostResponseDto>> getMyPosts(
            @RequestParam Long memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("memberId {}의 게시글만 조회 요청, 페이지: {}, 사이즈: {}", memberId, page, size);
        List<ForumPostResponseDto> posts = forumEsService.searchPostsByMember(memberId, page, size);
        return ResponseEntity.ok(posts);
    }

    /**
     * 회원이 작성한 댓글만 조회하는 엔드포인트
     * 예: GET /api/forums/my/comments?memberId=66&page=0&size=10
     */
    @GetMapping("/comments")
    public ResponseEntity<List<ForumPostCommentResponseDto>> getMyComments(
            @RequestParam Long memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("memberId {}의 댓글만 조회 요청, 페이지: {}, 사이즈: {}", memberId, page, size);
        List<ForumPostCommentResponseDto> comments = forumEsService.searchCommentsByMember(memberId, page, size);
        return ResponseEntity.ok(comments);
    }
}