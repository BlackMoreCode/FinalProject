package com.kh.back.controller;

import com.kh.back.dto.profile.CustomStyleDto;
import com.kh.back.dto.profile.ProfileUpdateDto;
import com.kh.back.dto.profile.ProfileCardWithStyleDto;
import com.kh.back.service.FirebaseService;
import com.kh.back.service.ProfileService;
import com.kh.back.service.recipe.RecipeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final FirebaseService firebaseService;
    private final RecipeService recipeService;

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

    @PutMapping("/info")
    public ResponseEntity<Void> updateProfile(Authentication authentication, @RequestBody Map<String, String> updates) {
        profileService.updateProfile(authentication, updates);
        return ResponseEntity.ok().build();
    }

    // 4. 맴버 아이디 반환
    @GetMapping("/getId")
    public String getMemberId(Authentication authentication) {
        log.info("맴버 아이디 : {}", authentication.getName());
        return authentication.getName();
    }

    // 이미지 업로드
    @PostMapping("/image")
    public ResponseEntity<String> uploadProfileImage(@RequestParam("file") MultipartFile file, Authentication authentication) {
        try {
            profileService.saveImageUrl(file, authentication);
            return ResponseEntity.ok("프로필 이미지가 성공적으로 업로드되었습니다.");
        } catch (Exception e) {
            log.error("프로필 이미지 업로드 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("업로드 실패: " + e.getMessage());
        }
    }

    // 이미지 가져오기
    @GetMapping("/image")
    public ResponseEntity<String> getProfileImage(Authentication authentication) {
        try {
            String imageUrl = firebaseService.getProfileImage(authentication);
            return ResponseEntity.ok(imageUrl != null ? imageUrl : "이미지가 없습니다.");
        } catch (Exception e) {
            log.error("프로필 이미지 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("조회 실패: " + e.getMessage());
        }
    }

    // 특정 유저 프로필 이미지 가져오기
    @GetMapping("/image/{memberId}")
    public ResponseEntity<String> getMemberProfileImage(@PathVariable Long memberId) {
        try {
            String imageUrl = firebaseService.getMemberProfileImage(memberId);
            return ResponseEntity.ok(imageUrl != null ? imageUrl : "이미지가 없습니다.");
        } catch (Exception e) {
            log.error("특정 유저 프로필 이미지 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("조회 실패: " + e.getMessage());
        }
    }
    @GetMapping("/get")
    public ResponseEntity<ProfileUpdateDto> getProfileInfo(Authentication authentication) {
        try {
            ProfileUpdateDto profile = profileService.getProfileInfo(authentication);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            log.error("프로필 정보 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    /**
     * 특정 유저가 작성한 레시피 조회 (페이지네이션 및 무한 스크롤 지원)
     *
     * @param memberId 유저 ID
     * @param page     페이지 번호 (기본값: 0)
     * @param size     페이지 당 항목 수 (기본값: 10)
     * @return 레시피 리스트 (id, title, createdAt)
     */
    @GetMapping("/recipes")
    public List<Map<String, Object>> getUserRecipes(
            @RequestParam Long memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("레시피 조회 요청: memberId={}, page={}, size={}", memberId, page, size);
        return recipeService.getUserRecipes(memberId, page, size);
    }
}