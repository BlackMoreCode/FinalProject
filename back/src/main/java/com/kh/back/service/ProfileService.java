package com.kh.back.service;

import com.kh.back.dto.profile.CustomStyleDto;
import com.kh.back.dto.profile.ProfileUpdateDto;
import com.kh.back.dto.profile.ProfileCardWithStyleDto;
import com.kh.back.entity.CustomStyle;
import com.kh.back.entity.member.Member;
import com.kh.back.repository.CustomStyleRepository;
import com.kh.back.repository.member.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.Map;

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
        Long userId = Long.valueOf(authentication.getName());
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
        customStyle.setMember(member);

        // 스타일 정보 저장
        memberRepository.save(member);
    }

    public void updateProfile(Authentication authentication, Map<String, String> updates) {
        Long userId = Long.valueOf(authentication.getName());
        log.info("프로필 정보 수정시 맴버 아이디 값 : {}", userId);

        // 회원 정보를 가져옵니다.
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 전달된 업데이트 정보에 대해 반복문을 통해 필드 갱신
        updates.forEach((key, value) -> {
            try {
                // 해당 필드의 setter 메서드를 동적으로 호출
                Method method = member.getClass().getMethod("set" + capitalizeFirstLetter(key), String.class);
                method.invoke(member, value);
            } catch (Exception e) {
                log.error("필드 업데이트 오류: {}", e.getMessage());
            }
        });

        // 회원 정보 저장
        memberRepository.save(member);
    }

    // 첫 글자 대문자로 변환
    private String capitalizeFirstLetter(String input) {
        if (input == null || input.isEmpty()) return input;
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }

    public void saveImageUrl(MultipartFile file, Authentication authentication) throws IOException {
        try {
            // 인증된 유저 가져오기
            Long memberId = Long.valueOf(authentication.getName());
            Member member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

            // 파이어베이스에 업로드하고 URL 반환
            String imageUrl = FirebaseService.uploadProfileImage(file);
            log.info("저장하려는 유저 id값 {}", member.getMemberId());
            log.info("저장하려는 유저 이름 {}", member.getNickName());
            log.info("저장하려는 이미지 url 주소값 : {}", imageUrl);

            // DB에 이미지 URL 저장
            member.setMemberImg(imageUrl);
            memberRepository.save(member);
            log.info("DB에 이미지 URL 저장 성공: {}", imageUrl);

        } catch (IllegalArgumentException e) {
            log.error("회원 정보를 찾을 수 없습니다: {}", e.getMessage());
            throw e; // 예외를 다시 던져서 호출자에게 전달
        } catch (IOException e) {
            log.error("파일 처리 중 오류 발생: {}", e.getMessage());
            throw e; // 예외를 다시 던져서 호출자에게 전달
        } catch (Exception e) {
            log.error("알 수 없는 오류 발생: {}", e.getMessage());
            throw new RuntimeException("이미지 저장 과정에서 오류가 발생했습니다.", e);
        }
    }

    public ProfileUpdateDto getProfileInfo(Authentication authentication) {
        Long memberId = Long.valueOf(authentication.getName()); // 현재 로그인한 유저의 이메일 가져오기
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        return new ProfileUpdateDto(member.getNickName(), member.getIntroduce(), member.getMemberImg());
    }

}