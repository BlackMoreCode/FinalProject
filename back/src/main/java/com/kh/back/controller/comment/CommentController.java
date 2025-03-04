package com.kh.back.controller.comment;

import com.kh.back.dto.comment.CommentReqDto;
import com.kh.back.dto.comment.CommentResDto;
import com.kh.back.service.comment.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {
    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/{recipeId}")
    public List<CommentResDto> getCommentsByRecipeId(@PathVariable String recipeId) {
        return commentService.getCommentsByRecipeId(recipeId);
    }

    @PostMapping
    public ResponseEntity<Boolean> addComment(@RequestHeader("Authorization") String token,
                                              @RequestBody CommentReqDto commentReqDto) {
        // 댓글 추가
        boolean isSaved = commentService.addComment(token, commentReqDto);
        // 댓글이 성공적으로 저장되었으면 true, 아니면 false 반환
        return ResponseEntity.ok(isSaved);
    }



}
