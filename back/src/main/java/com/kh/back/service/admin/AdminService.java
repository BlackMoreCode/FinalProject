package com.kh.back.service.admin;



import com.kh.back.config.MultipartInputStreamFileResource;
import com.kh.back.constant.Authority;
import com.kh.back.dto.admin.res.AdminMemberListResDto;
import com.kh.back.dto.admin.res.AdminMemberResDto;
import com.kh.back.dto.admin.request.AdminMemberReqDto;
import com.kh.back.repository.member.MemberRepository;
import com.kh.back.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.kh.back.entity.member.Member;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {
	private final MemberRepository memberRepository;
	private final MemberService memberService;
	private final String FLASK_URL = "http://localhost:5001";
	private final RestTemplate restTemplate;
	
	public List<AdminMemberListResDto> getMemberList(String searchValue, Authentication auth ) {
		try {
			Member member = memberService.convertAuthToEntity(auth);
			if (!member.getAuthority().equals(Authority.ROLE_ADMIN)){
				log.error("관리자가 아닌 회원이 회원정보 리스트를 조회하고 있습니다. : {}", member);
				return null;
			}
			log.warn("검색 : {}", searchValue);
			List<Member> memberList;
			if (searchValue != null && !searchValue.isEmpty() && !searchValue.equals("null")) {
				memberList = memberRepository.findAllByAuthority(Authority.fromString(searchValue));
			}
			else {
				memberList = memberRepository.findAll();
			}
			log.warn("회원 정보 전체 검색 {}, 결과 {}개 : {}", searchValue, memberList.size(), memberList);
			return convertMemberListToDtoList(memberList);
		} catch (Exception e) {
			log.error("멤버 리스트 조회중 에러 : {}", e.getMessage());
			return null;
		}
	}
	
	public AdminMemberResDto getMemberById(Long id, Authentication auth) {
		try {
			Member member = memberService.convertAuthToEntity(auth);
			if (!member.getAuthority().equals(Authority.ROLE_ADMIN)){
				log.error("관리자가 아닌 회원이 회원정보 상세를 조회하고 있습니다. : {}", member);
				return null;
			}
			member = memberRepository.findByMemberId(id)
				.orElseThrow(() -> new RuntimeException("해당하는 유저가 존재하지 않습니다."));
			log.warn("id를 통해 검색 : {}", member);
			return convertMemberToDto(member);
		} catch (Exception e) {
			log.error("아이디를 통해 회원 검색중 에러 : {}", e.getMessage());
			return null;
		}
	}
	
	@Transactional
	public AdminMemberResDto editMember(AdminMemberReqDto dto, Authentication auth) {
		try {
			Member member = memberService.convertAuthToEntity(auth);
			if (!member.getAuthority().equals(Authority.ROLE_ADMIN)){
				log.error("관리자가 아닌 회원이 회원정보 를 수정하고 있습니다. : {}", member);
				return null;
			}
			member = memberRepository.findByMemberId(dto.getMemberId())
				.orElseThrow(() -> new RuntimeException("해당 회원이 존재하지 않습니다."));
			if (dto.getMemberImg()) {
				member.setMemberImg(null);
			}
			if (dto.getAuthority() != null) {
				member.setAuthority(Authority.fromString(dto.getAuthority()));
			}
			if (dto.getIntroduce()) {
				member.setIntroduce(null);
			}
			log.warn("수정하려는 회원 : {}", member);
			member = memberRepository.save(member);
			return convertMemberToDto(member);
		} catch (Exception e) {
			log.error("회원 정보 수정중 에러 : {}", e.getMessage());
			return null;
		}
	}
	
	public boolean uploadJson(String type, MultipartFile file, Authentication auth) {
		try {
			Member member = memberService.convertAuthToEntity(auth);
			if (!member.getAuthority().equals(Authority.ROLE_ADMIN)) {
				log.error("관리자가 아닌 회원이 JSON 데이터를 업로드하고 있습니다. : {}", member);
				return false;
			}
			
			// Flask 서버 URL
			URI uri = new URI(FLASK_URL + "/upload/json");
			
			// HTTP 요청 헤더 설정
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.MULTIPART_FORM_DATA);
			
			// 파일 및 추가 데이터 구성
			MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
			body.add("file", new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename()));
			body.add("type", type);
			
			HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
			
			// Flask 서버로 요청 전송
			ResponseEntity<String> response = restTemplate.postForEntity(uri, requestEntity, String.class);
			
			if (response.getStatusCode() == HttpStatus.OK) {
				log.info("JSON 업로드 성공: {}", response.getBody());
				return true;
			} else {
				log.error("JSON 업로드 실패: {}", response.getBody());
				return false;
			}
		} catch (Exception e) {
			log.error("JSON 데이터 업로드 중 에러 : {}", e.getMessage());
			return false;
		}
	}
	
	
	
	private List<AdminMemberListResDto> convertMemberListToDtoList(List<Member> memberList) {
		List<AdminMemberListResDto> list = new ArrayList<>();
		for (Member member : memberList) {
			AdminMemberListResDto dto = new AdminMemberListResDto();
			dto.setMemberImg(member.getMemberImg());
			dto.setId(member.getMemberId());
			dto.setAuthority(member.getAuthority());
			dto.setNickname(member.getNickName());
			list.add(dto);
		}
		return list;
	}
	
	private AdminMemberResDto convertMemberToDto(Member member) {
		AdminMemberResDto dto = new AdminMemberResDto();
		dto.setAuthority(member.getAuthority());
		dto.setId(member.getMemberId());
		dto.setPhone(member.getPhone());
		dto.setEmail(member.getEmail());
		dto.setNickname(member.getNickName());
		dto.setMemberImg(member.getMemberImg());
		dto.setIntroduce(member.getIntroduce());
		dto.setRegDate(member.getRegDate());
		return dto;
	}
}
