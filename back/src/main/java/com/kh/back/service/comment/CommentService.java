package com.kh.back.service.comment;

import com.kh.back.dto.comment.CommentReqDto;
import com.kh.back.dto.comment.CommentResDto;
import com.kh.back.entity.Comment;
import com.kh.back.entity.Member;
import com.kh.back.repository.CommentRepository;
import com.kh.back.repository.MemberRepository;
import com.kh.back.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final MemberService memberService;
    private final MemberRepository memberRepository;


    @Transactional
    public boolean addComment(String token, CommentReqDto commentReqDto) {
        try {
            // 멤버 ID 가져오기
            Long memberId = memberService.getMemberId(token);

            // 멤버 존재 여부 확인
            Member member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

            // 댓글 객체 생성
            Comment comment = new Comment();
            comment.setMember(member);  // 회원 설정
            comment.setRecipeId(commentReqDto.getRecipeId());  // 레시피 설정
            comment.setContent(commentReqDto.getContent());  // 댓글 내용 설정

            // 댓글 저장
            commentRepository.save(comment);

            return true;  // 댓글 저장 성공
        } catch (Exception e) {
            // 예외가 발생하면 false 반환
            return false;
        }
    }

    // 레시피 아이디로 댓글 가져오기
    public List<CommentResDto> getCommentsByRecipeId(String recipeId) {
        List<Comment> comments = commentRepository.findByRecipeId(recipeId);  // 레시피 아이디로 댓글을 조회
        return comments.stream()
                .map(CommentResDto::fromEntity)  // Comment 객체를 CommentResDto로 변환
                .collect(Collectors.toList());   // 리스트로 반환
    }

}
