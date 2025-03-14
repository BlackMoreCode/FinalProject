package com.kh.back.service.redux;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.back.constant.Action;
import com.kh.back.constant.Authority;
import com.kh.back.dto.member.res.MemberPublicResDto;
import com.kh.back.dto.member.res.ReduxResDto;
import com.kh.back.entity.Reaction;
import com.kh.back.entity.member.Member;
import com.kh.back.repository.ReactionRepository;
import com.kh.back.repository.auth.RefreshTokenRepository;
import com.kh.back.repository.member.MemberRepository;
import com.kh.back.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReduxService {
	private final MemberRepository memberRepository;
	private final ObjectMapper objectMapper;
	private final MemberService memberService;
	@Autowired
	private ReactionRepository reactionRepository;

	public MemberPublicResDto getMemberPublicResDto(Long id) {
		Member member = memberRepository.findById(id)
			.orElseThrow(() -> new RuntimeException("해당 사용자가 없습니다."));
		return objectMapper.convertValue(member, MemberPublicResDto.class);
	}

	public ReduxResDto getMyInfo(Authentication auth) {
		try {
			// 인증된 사용자 정보를 가져옴
			Member member = memberService.convertAuthToEntity(auth);
			if (member == null || member.getAuthority() == Authority.REST_USER) {
				return null;
			}

			// Reaction 데이터를 가져오기 위한 로직
			List<Reaction> reactions = reactionRepository.findByMember(member);

			// 좋아요 및 신고한 레시피 ID 리스트 만들기
			Set<String> likedRecipes = reactions.stream()
					.filter(reaction -> reaction.getAction() == Action.likes)
					.map(Reaction::getPostId)
					.collect(Collectors.toSet());

			Set<String> reportedRecipes = reactions.stream()
					.filter(reaction -> reaction.getAction() == Action.reports)
					.map(Reaction::getPostId)
					.collect(Collectors.toSet());

			// ReduxResDto 생성
			ReduxResDto reduxResDto = new ReduxResDto();
			reduxResDto.setId(member.getMemberId());
			reduxResDto.setEmail(member.getEmail());
			reduxResDto.setNickname(member.getNickName());
			reduxResDto.setRole(member.getAuthority());

			// 좋아요 및 신고한 레시피 ID 추가
			reduxResDto.setLikedRecipes(likedRecipes);
			reduxResDto.setReportedRecipes(reportedRecipes);

			return reduxResDto;
		} catch (Exception e) {
			log.error(e.getMessage());
			return null;
		}
	}


}
