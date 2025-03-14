package com.kh.back.controller.comment;

import com.kh.back.dto.comment.CommentReqDto;
import com.kh.back.dto.comment.CommentResDto;
import com.kh.back.dto.comment.ReplyReqDto;
import com.kh.back.service.comment.CommentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/comments")
public class CommentController {
    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }
    @GetMapping("/{recipeId}")
    public ResponseEntity<Page<CommentResDto>> getCommentsByRecipeId(
            @PathVariable String recipeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) { // ✅ 한 페이지당 5개 설정
        Pageable pageable = PageRequest.of(page, size, Sort.by("commentId").descending());
        Page<CommentResDto> commentPage = commentService.getCommentsByRecipeId(recipeId, pageable);
        return ResponseEntity.ok(commentPage);
    }

    @PostMapping("/addComment")
    public ResponseEntity<Boolean> addComment(Authentication authentication,
                                              @RequestBody CommentReqDto commentReqDto) {
        Long memberId = Long.parseLong(authentication.getName());
        boolean isSaved = commentService.addComment(memberId, commentReqDto);
        // 댓글이 성공적으로 저장되었으면 true, 아니면 false 반환
        return ResponseEntity.ok(isSaved);
    }

    @PostMapping("/addReply")
    public ResponseEntity<Boolean> addReply(Authentication authentication,
                                            @RequestBody ReplyReqDto replyReqDto) {
        Long memberId = Long.parseLong(authentication.getName());
        boolean isSaved = commentService.addReply(memberId, replyReqDto);
        // 대댓글이 성공적으로 저장되었으면 true, 아니면 false 반환
        return ResponseEntity.ok(isSaved);
    }




}
