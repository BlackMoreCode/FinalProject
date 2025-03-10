package com.kh.back.service.action;

import com.kh.back.entity.Reaction;
import com.kh.back.entity.member.Member;

import com.kh.back.constant.Action;
import com.kh.back.repository.member.MemberRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReActionService {


    private final MemberRepository memberRepository;

    public ReActionService(MemberRepository memberRepository) {

        this.memberRepository = memberRepository;
    }

    @Transactional
    public boolean updateAction(Authentication authentication, String action, String postId) {
        // 인증 정보를 통해 현재 로그인한 사용자 정보 가져오기
        String username = authentication.getName();
        Member member = memberRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보가 존재하지 않습니다."));

        // Action enum 변환
        Action reactionAction = Action.valueOf(action);


        return true; // 성공적으로 업데이트되었음을 반환
    }
}
