	package com.kh.back.controller;

	import com.kh.back.dto.auth.AccessTokenDto;
	import com.kh.back.dto.auth.TokenDto;
	import com.kh.back.entity.Member;
	import com.kh.back.jwt.TokenProvider;
	import com.kh.back.security.SecurityUtil;
	import com.kh.back.service.MemberService;
	import com.kh.back.service.auth.AuthService;
	import com.kh.back.service.auth.EmailService;
	import com.kh.back.service.auth.SmsService;
	import lombok.RequiredArgsConstructor;
	import lombok.extern.slf4j.Slf4j;
	import org.springframework.http.HttpStatus;
	import org.springframework.http.ResponseEntity;
	import org.springframework.security.crypto.password.PasswordEncoder;
	import org.springframework.web.bind.annotation.*;
	
	import java.util.List;
	
	
	@Slf4j
	@CrossOrigin(origins = "http://localhost:3000")
	@RestController
	@RequestMapping("/auth")
	@RequiredArgsConstructor
	public class AuthController {
		private final AuthService authService;
		private final SmsService smsService;
		private final EmailService emailService;
		private final PasswordEncoder passwordEncoder;
		private  final TokenProvider tokenProvider;
		private final MemberService memberService;
		
		// 회원가입 여부 확인 , 이메일 중복 확인
		@GetMapping("/exist/{email}")
		public ResponseEntity<Boolean> existEmail(@PathVariable String email) {
			boolean isMember = authService.existEmail(email);
			log.info("isMember : {}", isMember);
			return ResponseEntity.ok(isMember);
		}

		// 닉네임 중복 확인
		@GetMapping("/nickname/{nickname}")
		public ResponseEntity<Boolean> existNickName(@PathVariable String nickname) {
			boolean existNickName = authService.existNickName(nickname);
			log.info("existNickName : {}", existNickName);
			return ResponseEntity.ok(existNickName);
		}

		@GetMapping("/phone/{phone}")
		public ResponseEntity<Boolean> existPhone(@PathVariable String phone) {
			boolean existPhone = authService.existPhone(phone);
			log.info("existPhone : {}", existPhone);
			return ResponseEntity.ok(existPhone);
		}

//		// 회원 가입
//		@PostMapping("/signup")
//		public ResponseEntity<MemberPublicResDto> signup(@RequestBody MemberReqDto memberReqDto) {
//			MemberPublicResDto memberResDto = authService.signup(memberReqDto);
//			log.info("signup : {}", memberResDto);
//			return ResponseEntity.ok(memberResDto);
//		}

		// 이메일 전송 - 비밀번호 찾기
		@PostMapping("/sendPw")
		public ResponseEntity<Boolean> sendPw(@RequestBody Member member) {
			log.info("메일:{}", member.getEmail());

			// 이메일로 비밀번호 재설정 토큰 전송
			boolean result = emailService.sendPasswordResetToken(member.getEmail());

			return ResponseEntity.ok(result);
		}

		// 이메일 인증 토큰 검증
		@PostMapping("/verify-email-token")
		public ResponseEntity<Boolean> verifyEmailToken(@RequestBody TokenVerificationRequest request) {
			boolean isValid = emailService.verifyEmailToken(request.getEmail(), request.getInputToken());
			return ResponseEntity.ok(isValid);
		}



		// 이메일과 입력된 토큰을 받을 DTO 클래스
		public static class TokenVerificationRequest {
			private String email;
			private String inputToken;

			// Getters and Setters
			public String getEmail() {
				return email;
			}

			public void setEmail(String email) {
				this.email = email;
			}

			public String getInputToken() {
				return inputToken;
			}

			public void setInputToken(String inputToken) {
				this.inputToken = inputToken;
			}
		}
		@PostMapping("/sendSms")
		public ResponseEntity<String> sendSms(@RequestBody Member member) {
			String result = smsService.sendVerificationCode(member.getPhone());
			log.info("SMS 전송 결과: {}", ResponseEntity.ok(result));
			return ResponseEntity.ok(result);
		}



		// SMS 인증 토큰 검증
		@PostMapping("/verify-sms-token")
		public ResponseEntity<Boolean> verifySmsCode(@RequestBody smsTokenVerificationRequest request) {
			boolean isValid = smsService.verifySmsCode(request.getPhone(), request.getInputToken());
			return ResponseEntity.ok(isValid);
		}

		// 전화번호와 입력된 인증번호를 받을 DTO 클래스
		public static class smsTokenVerificationRequest {
			private String phone;
			private String inputToken;

			// Getters and Setters
			public String getPhone() {
				return phone;
			}

			public void setPhone(String phone) {
				this.phone = phone;
			}

			public String getInputToken() {
				return inputToken;
			}

			public void setInputToken(String inputToken) {
				this.inputToken = inputToken;
			}
		}

//		@GetMapping("/email/{phone}")
//		public ResponseEntity<?> findEmailByPhone(@PathVariable String phone) {
//			try {
//				MemberPublicResDto memberResDto = memberService.findEmailByPhone(phone);
//				log.info("memberResDto : {}", memberResDto);
//				return ResponseEntity.ok(memberResDto.getEmail());
//			} catch (RuntimeException e) {
//				log.warn("회원 정보를 찾을 수 없습니다. phone: {}", phone, e);
//				return ResponseEntity.status(HttpStatus.NOT_FOUND)
//						.body("해당 회원이 존재하지 않습니다.");
//			}
//		}


		// 리프레시 토큰으로 새 액세스 토큰 발급
		@GetMapping("/refresh")
		public ResponseEntity<AccessTokenDto> newToken(@RequestParam String refreshToken) {
			return ResponseEntity.ok(authService.refreshAccessToken(refreshToken));
		}

//		// 로그인
//		@PostMapping("/login")
//		public ResponseEntity<TokenDto> login(@RequestBody MemberReqDto memberReqDto) {
//			TokenDto tokenDto = authService.login(memberReqDto);
//			log.info("tokenDto : {}", tokenDto);
//			return ResponseEntity.ok(tokenDto);
//		}
		
//		@PostMapping("/change-password")
//		public ResponseEntity<Boolean> changePassword(@RequestBody MemberReqDto memberReqDto) {
//			try {
//				emailService.changePassword(memberReqDto.getPwd(), passwordEncoder); // 비밀번호 변경 로직 호출
//				return ResponseEntity.ok(true); // 성공적으로 변경되었음을 true로 반환
//			} catch (RuntimeException e) {
//				return ResponseEntity.ok(false); // 실패했음을 false로 반환
//			}
//		}
	
	}











