package com.kh.back.service;

import com.kh.back.dto.profile.CustomStyleDto;
import com.kh.back.dto.profile.ProfileUpdateDto;
import com.kh.back.dto.profile.ProfileCardWithStyleDto;
import com.kh.back.entity.CustomStyle;
import com.kh.back.entity.Member;
import com.kh.back.repository.CustomStyleRepository;
import com.kh.back.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ProfileService {
    private final MemberRepository memberRepository;
    private final CustomStyleRepository customStyleRepository;


    public ProfileService(MemberRepository memberRepository, CustomStyleRepository customStyleRepository) {
        this.memberRepository = memberRepository;
        this.customStyleRepository = customStyleRepository;
    }
    // 1. id 값으로 프로필 정보와 커스텀 카드 스타일을 반환하는 메소드
    public ProfileCardWithStyleDto getProfileInfoById(Long memberId) {
        // Member 엔티티 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 커스텀 스타일 정보 조회
        CustomStyle customStyle = customStyleRepository.findByMember_MemberId(memberId)
                .orElse(null); // 스타일 정보가 없으면 null 반환

        if (customStyle == null) {
            // 기본 스타일 설정
            customStyle = new CustomStyle();
            customStyle.setBgColor("#ffffff");
            customStyle.setNicknameFont("Arial, sans-serif");
            customStyle.setNicknameSize("1.5rem");
            customStyle.setIntroduceFont("Georgia, serif");
            customStyle.setIntroduceSize("1rem");
            customStyle.setTextColorNickname("#000000");
            customStyle.setTextColorIntroduce("#333333");
        }

        // ProfileCardWithStyleDto로 반환
        return ProfileCardWithStyleDto.builder()
                .nickName(member.getNickName())
                .memberImg(member.getMemberImg())
                .introduce(member.getIntroduce())
                .bgColor(customStyle.getBgColor())
                .nicknameFont(customStyle.getNicknameFont())
                .nicknameSize(customStyle.getNicknameSize())
                .introduceFont(customStyle.getIntroduceFont())
                .introduceSize(customStyle.getIntroduceSize())
                .textColorNickname(customStyle.getTextColorNickname())
                .textColorIntroduce(customStyle.getTextColorIntroduce())
                .build();
    }
    // 2. Authentication과 스타일 값을 받아 스타일 정보 갱신
    public void updateCustomStyle(Authentication authentication, CustomStyleDto customStyleDto) {
        // Authentication을 통해 현재 로그인된 유저의 ID 가져오기
        Long userId = ((Member) authentication.getPrincipal()).getMemberId();
        log.info("스타일 정보 갱신시 맴버 아이디 값 : {}", userId);

        // 유저의 스타일 정보 조회 및 업데이트
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CustomStyle customStyle = member.getCustomStyle();
        if (customStyle == null) {
            customStyle = new CustomStyle();
            member.setCustomStyle(customStyle);
        }

        customStyle.setBgColor(customStyleDto.getBgColor());
        customStyle.setNicknameFont(customStyleDto.getNicknameFont());
        customStyle.setNicknameSize(customStyleDto.getNicknameSize());
        customStyle.setIntroduceFont(customStyleDto.getIntroduceFont());
        customStyle.setIntroduceSize(customStyleDto.getIntroduceSize());
        customStyle.setTextColorNickname(customStyleDto.getTextColorNickname());
        customStyle.setTextColorIntroduce(customStyleDto.getTextColorIntroduce());

        // 스타일 정보 저장
        memberRepository.save(member);
    }

    // 3. Authentication과 프로필 정보를 받아 유저 정보 수정
    public void updateProfile(Authentication authentication, ProfileUpdateDto profileUpdateDto) {
        Long userId = ((Member) authentication.getPrincipal()).getMemberId();
        log.info("프로필 정보 수정시 맴버 아이디 값 : {}", userId);

        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        member.setNickName(profileUpdateDto.getNickName());
        member.setMemberImg(profileUpdateDto.getMemberImg());
        member.setIntroduce(profileUpdateDto.getIntroduce());

        memberRepository.save(member);
    }



}