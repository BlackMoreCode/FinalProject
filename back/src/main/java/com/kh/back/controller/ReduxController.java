package com.kh.back.controller;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.back.constant.Authority;
import com.kh.back.dto.member.res.ReduxResDto;
import com.kh.back.service.MemberService;
import com.kh.back.service.redux.ReduxService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/redux")
@RequiredArgsConstructor
public class ReduxController {
	private final ReduxService reduxService;
	
//	@GetMapping("/myinfo")
//	public ResponseEntity<ReduxResDto> myinfo(@RequestHeader("Authorization") String token) {
//		return ResponseEntity.ok(reduxService.getMyInfo(token));
//	}

	/**
	 * [현재 사용자 정보 조회 엔드포인트 - 테스트용]
	 * KR: Authorization 헤더를 필수가 아니게 설정하여, 토큰이 없을 경우 기본 사용자 정보를 반환합니다.
	 *
	 * @param token (선택적) Authorization 헤더 값, 없으면 기본값 사용
	 * @return ReduxResDto 기본 사용자 정보 또는 실제 사용자 정보
	 */
	@GetMapping("/myinfo")
	public ResponseEntity<ReduxResDto> myinfo(@RequestHeader(value = "Authorization", required = false) String token) {
		// KR: 테스트 목적으로, Authorization 헤더가 없으면 기본 사용자 정보를 반환
		if (token == null) {
			// KR: 토큰이 없는 경우, 기본 사용자 정보(테스트용)를 생성합니다.
			ReduxResDto defaultUser = new ReduxResDto(1L, "test@example.com", "TestUser", Authority.ROLE_USER);
			return ResponseEntity.ok(defaultUser);
		}
		// KR: 토큰이 있으면, 기존 서비스 로직을 통해 사용자 정보를 조회합니다.
		return ResponseEntity.ok(reduxService.getMyInfo(token));
	}
}

