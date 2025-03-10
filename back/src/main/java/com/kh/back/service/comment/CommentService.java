package com.kh.back.service.comment;

import com.kh.back.dto.comment.CommentReqDto;
import com.kh.back.dto.comment.CommentResDto;
import com.kh.back.dto.comment.ReplyReqDto;
import com.kh.back.entity.Comment;
import com.kh.back.entity.member.Member;
import com.kh.back.repository.CommentRepository;
import com.kh.back.repository.member.MemberRepository;
import com.kh.back.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    private final MemberRepository memberRepository;


    @Transactional
    public boolean addComment(Long memberId, CommentReqDto commentReqDto) {
        try {
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

    public boolean addReply(Long memberId, ReplyReqDto replyReqDto) {
        // 부모 댓글 찾기
        Comment parentComment = commentRepository.findById(replyReqDto.getParentCommentId())
                .orElseThrow(() -> new RuntimeException("부모 댓글을 찾을 수 없습니다."));
        // 회원 찾기
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));
        // 대댓글 생성
        Comment reply = new Comment();
        reply.setContent(replyReqDto.getContent());
        reply.setMember(member);  // 작성자 설정
        reply.setParentComment(parentComment);  // 부모 댓글 설정

        // 부모 댓글의 대댓글 목록에 추가 (수동으로 추가할 필요 없이, cascade 때문에 자동 저장됨)
        parentComment.getReplies().add(reply);

        // 부모 댓글을 저장하면, cascade로 대댓글도 함께 저장됨
        commentRepository.save(parentComment);  // 부모 댓글만 저장하면 대댓글도 저장됨
        return true;
    }

    // 레시피 아이디로 댓글 가져오기
    public List<CommentResDto> getCommentsByRecipeId(String recipeId) {
        List<Comment> comments = commentRepository.findByRecipeId(recipeId);  // 레시피 아이디로 댓글을 조회

        // 댓글과 대댓글을 포함하는 방식으로 변환
        return comments.stream()
                .filter(comment -> comment.getParentComment() == null)  // 부모 댓글만 필터링
                .map(comment -> {
                    // 부모 댓글에 대댓글을 포함시켜 반환
                    CommentResDto parentCommentDto = CommentResDto.fromEntity(comment);
                    return parentCommentDto;
                })
                .collect(Collectors.toList());   // 리스트로 반환
    }




    public Comment createReply(Long parentCommentId, CommentReqDto replyDto) {
        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new RuntimeException("부모 댓글을 찾을 수 없습니다."));

        Comment reply = new Comment();
        reply.setContent(replyDto.getContent());
        reply.setMember(new Member()); // 작성자 설정 (실제 작성자를 지정해야 합니다)
        reply.setParentComment(parentComment); // 부모 댓글 설정

        // 부모 댓글의 대댓글 목록에 추가
        parentComment.getReplies().add(reply);

        // 부모 댓글과 대댓글 모두 저장
        return commentRepository.save(parentComment); // 부모 댓글을 저장하면서 대댓글도 저장됨
    }


}
