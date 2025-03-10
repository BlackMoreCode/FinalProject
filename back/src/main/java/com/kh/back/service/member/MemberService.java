package com.kh.back.service.member;


import com.kh.back.constant.Authority;
import com.kh.back.entity.member.Member;
import com.kh.back.jwt.TokenProvider;
import com.kh.back.repository.member.MemberRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
@Service
@AllArgsConstructor // 생성자를 통한 의존성 주입을 받기 위해서 모든
public class MemberService {
	private MemberRepository memberRepository;
	private TokenProvider tokenProvider;
	private PasswordEncoder passwordEncoder;
	private final HttpServletRequest request;
	

	public boolean checkPassword(Authentication auth, String password) {
		Long memberId = getMemberId(auth);
		System.out.println(password);
		System.out.println(memberId);
		request.getSession().setAttribute("memberId", memberId);
		Optional<Member> memberOptional = memberRepository.findById(memberId);  // 이메일로 회원 조회

		if (memberOptional.isPresent()) {
			Member member = memberOptional.get();
			// 입력된 평문 비밀번호와 DB에 저장된 암호화된 비밀번호 비교
			return passwordEncoder.matches(password, member.getPwd());
		}

		return false;  // 이메일이 존재하지 않으면 false 반환
	}
	public boolean deleteMember(Long memberId) {
		try {
			Member member = memberRepository.findById(memberId)
					.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));

			// 회원 상태를 SECESSION으로 변경
			member.setAuthority(Authority.REST_USER);
			member.setEmail(memberId + "deleted" + UUID.randomUUID());
			member.setPwd( memberId + "password" + UUID.randomUUID());
			member.setName(null);
			member.setPhone(null);
			member.setRegDate(null);
			member.setAuthority(null);
			member.setUserId(memberId + "deleted" + UUID.randomUUID());
			memberRepository.save(member);

			return true;
		} catch (Exception e) {
			log.error("회원 탈퇴 처리에 실패 했습니다 : {}", e.getMessage());
			return false;
		}
	}

	public String getRole(Authentication auth) {
		return convertAuthToEntity(auth).getAuthority().toString();
	}
	
	public Long getMemberId(Authentication auth) {
		return Long.parseLong(auth.getName());
	}
	
	// 토큰에서 Member 객체를 받아오는 메서드( 클래스 외부에서도 불러올 수 있게 public )
	public Member convertAuthToEntity(Authentication authentication) {
		try{
			log.warn("Authentication 의 형태 : {}", authentication);
			// Name 은 String 으로 되어 있기 때문에 Long으로 바꿔주는 과정이 있어야 타입이 일치
			Long id = Long.parseLong(authentication.getName());
			Member member = memberRepository.findById(id)
				.orElseThrow(()-> new RuntimeException("존재 하지 않는 memberId 입니다."));
			log.warn("{} - {}",authentication, member);
			return member;
		} catch (Exception e) {
			log.error(e.getMessage());
			return null;
		}
	}

	public void updatePassword(String newPassword, PasswordEncoder passwordEncoder) {
		Long memberId = (Long) request.getSession().getAttribute("memberId"); // 수정된 세션 접근 방식
		System.out.println("세션 ID: " + request.getSession().getId());
		if (memberId == null) {
			throw new RuntimeException("정보가 만료 되었습니다. 인증을 다시 진행해주세요.");
		}
		Optional<Member> memberOptional = memberRepository.findById(memberId);
		Member member = memberOptional.orElseThrow(() -> new RuntimeException("이메일에 해당하는 회원이 존재하지 않습니다."));

		String encodedPassword = passwordEncoder.encode(newPassword);
		member.setPwd(encodedPassword);
		memberRepository.save(member);
		request.getSession().removeAttribute("memberId"); // 세션에서 이메일 제거
	}
	
	public Member getMemberById( Long memberId ) {
		return memberRepository.findById(memberId).orElse(null);
	}



	public boolean changeNickName(Authentication auth, String nickname) {

		Long memberId =getMemberId(auth);
		Member member = memberRepository.findById(memberId)
				.orElseThrow(() -> new RuntimeException("해당 이메일의 회원을 찾을 수 없습니다."));

		// 닉네임 변경
		member.setNickName(nickname);
		memberRepository.save(member); // 변경 사항 저장
		return true;
	}


//	// 회원 정보 수정
//	public boolean updateMember(MemberReqDto memberReqDto) {
//		try {
//			Member member = memberRepository.findByEmail(memberReqDto.getEmail())
//				.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));
//			member.setName(memberReqDto.getName());
//			memberRepository.save(member);
//			return true;
//		} catch (Exception e) {
//			log.error("회원 정보 수정중 오류 : {}", e.getMessage());
//			return false;
//		}
//	}




//	// Member Entity -> 회원 정보 DTO
//	private MemberPublicResDto convertEntityToDto(Member member) {
//		MemberPublicResDto memberResDto = new MemberPublicResDto();
//		memberResDto.setEmail(member.getEmail());
//		memberResDto.setName(member.getName());
////		memberResDto.setRegDate(member.getRegDate());
////		memberResDto.setPhone(m)
//		memberResDto.setRegDate(member.getRegDate());
//		return memberResDto;
//	}

	/**
	 * isAdmin 메서드
	 * KR: 회원 ID를 받아 해당 회원의 authority 필드를 검사합니다.
	 *     ROLE_ADMIN이면 true를 반환하여 관리자인지 확인합니다.
	 *
	 * @param memberId 회원 ID (Long)
	 * @return true if the member is an admin, false otherwise.
	 */
	public boolean isAdmin(Long memberId) {
		// 회원을 조회하고, authority가 ROLE_ADMIN이면 true 반환
		Member member = memberRepository.findById(memberId)
				.orElseThrow(() -> new IllegalArgumentException("유효하지 않은 회원 ID입니다: " + memberId));
		return member.getAuthority() == Authority.ROLE_ADMIN;
	}
}