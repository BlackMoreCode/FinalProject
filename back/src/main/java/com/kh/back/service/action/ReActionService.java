package com.kh.back.service.action;

import com.kh.back.entity.Reaction;
import com.kh.back.entity.member.Member;

import com.kh.back.constant.Action;
import com.kh.back.repository.ReactionRepository;
import com.kh.back.repository.member.MemberRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ReActionService {


    private final MemberRepository memberRepository;
    private final ReactionRepository reactionRepository;
    public ReActionService(MemberRepository memberRepository, ReactionRepository reactionRepository) {
        this.reactionRepository = reactionRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional
    public void updateAction(Authentication authentication, String action, String postId) {
        // 인증 정보를 통해 현재 로그인한 사용자 정보 가져오기
        Long memberId = Long.parseLong(authentication.getName());
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보가 존재하지 않습니다."));
        Action reactionAction = Action.valueOf(action);
        Reaction newReaction = new Reaction(member, postId, reactionAction);
        reactionRepository.save(newReaction);
    }
    @Transactional
    public void deleteAction(Authentication authentication, String postId) {
        // 인증 정보를 통해 현재 로그인한 사용자 정보 가져오기
        Long memberId = Long.parseLong(authentication.getName());
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보가 존재하지 않습니다."));
        // 해당 사용자가 해당 게시물에 남긴 Reaction 조회
        Optional<Reaction> reaction = reactionRepository.findByMemberAndPostId(member, postId);
        if (reaction.isPresent()) {
            reactionRepository.delete(reaction.get());
        } else {
            throw new IllegalArgumentException("해당 게시물에 대한 반응이 존재하지 않습니다.");
        }
    }
}
