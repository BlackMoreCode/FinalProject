package com.kh.back.controller;

import com.kh.back.dto.profile.CustomStyleDto;
import com.kh.back.dto.profile.ProfileUpdateDto;
import com.kh.back.dto.profile.ProfileCardWithStyleDto;
import com.kh.back.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // 1. 프로필 정보와 스타일 조회
    @GetMapping("/{memberId}")
    public ResponseEntity<ProfileCardWithStyleDto> getProfileInfo(@PathVariable Long memberId) {
        log.info("조회할 프로필 카드의 유저 ID : {}", memberId);
        ProfileCardWithStyleDto profileCardWithStyleDto = profileService.getProfileInfoById(memberId);
        return ResponseEntity.ok(profileCardWithStyleDto);
    }

    // 2. 스타일 정보 갱신
    @PutMapping("/style")
    public ResponseEntity<Void> updateCustomStyle(Authentication authentication, @RequestBody CustomStyleDto customStyleDto) {
        profileService.updateCustomStyle(authentication, customStyleDto);
        return ResponseEntity.ok().build();
    }

    // 3. 프로필 정보 수정
    @PutMapping("/info")
    public ResponseEntity<Void> updateProfile(Authentication authentication, @RequestBody ProfileUpdateDto profileUpdateDto) {
        profileService.updateProfile(authentication, profileUpdateDto);
        return ResponseEntity.ok().build();
    }

    // 4. 맴버 아이디 반환
    @GetMapping("/getId")
    public String getMemberId(Authentication authentication) {
        log.info("맴버 아이디 : {}", authentication.getName());
        return authentication.getName();
    }
}