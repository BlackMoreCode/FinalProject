package com.kh.back.service.redux;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.back.constant.Authority;
import com.kh.back.dto.member.res.MemberPublicResDto;
import com.kh.back.dto.member.res.ReduxResDto;
import com.kh.back.entity.member.Member;
import com.kh.back.repository.member.MemberRepository;
import com.kh.back.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReduxService {
	private final MemberRepository memberRepository;
	private final ObjectMapper objectMapper;
	private final MemberService memberService;
	
	public MemberPublicResDto getMemberPublicResDto(Long id) {
		Member member = memberRepository.findById(id)
			.orElseThrow(() -> new RuntimeException("해당 사용자가 없습니다."));
		return objectMapper.convertValue(member, MemberPublicResDto.class);
	}
	
	public ReduxResDto getMyInfo(Authentication auth) {
		try {
			Member member = memberService.convertAuthToEntity(auth);
			if (member == null || member.getAuthority() == Authority.REST_USER) {
				return null;
			}
			ReduxResDto reduxResDto = new ReduxResDto();
			reduxResDto.setId(member.getMemberId());
			reduxResDto.setEmail(member.getEmail());
			reduxResDto.setNickname(member.getNickName());
			reduxResDto.setRole(member.getAuthority());
			return reduxResDto;
		} catch (Exception e) {
			log.error(e.getMessage());
			return null;
		}
	}
}
