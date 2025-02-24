package com.kh.back.service.redux;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.back.dto.member.res.MemberPublicResDto;
import com.kh.back.entity.Member;
import com.kh.back.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReduxService {
	private final MemberRepository memberRepository;
	private final ObjectMapper objectMapper;
	
	public MemberPublicResDto getMemberPublicResDto(Long id) {
		Member member = memberRepository.findById(id)
			.orElseThrow(() -> new RuntimeException("해당 사용자가 없습니다."));
		return objectMapper.convertValue(member, MemberPublicResDto.class);
	}
}
