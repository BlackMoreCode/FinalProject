package com.kh.back.controller;



import com.kh.back.dto.admin.request.AdminMemberReqDto;
import com.kh.back.dto.admin.res.AdminMemberListResDto;
import com.kh.back.dto.admin.res.AdminMemberResDto;
import com.kh.back.dto.python.SearchListResDto;
import com.kh.back.entity.member.Member;
import com.kh.back.service.admin.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AdminController {
	
	private final AdminService adminService;
	
	@GetMapping("/member/list/{searchValue}")
	public ResponseEntity<List<AdminMemberListResDto>> getMemberList(@PathVariable String searchValue, Authentication authentication) {
		List<AdminMemberListResDto> memberList = adminService.getMemberList(searchValue, authentication);
		return ResponseEntity.ok(memberList);
	}
	
	@GetMapping("/member/detail/{id}")
	public ResponseEntity<AdminMemberResDto> getMember(@PathVariable Long id, Authentication authentication) {
		AdminMemberResDto member = adminService.getMemberById(id, authentication);
		return ResponseEntity.ok(member);
	}
	
	@PostMapping("/member/edit")
	public ResponseEntity<AdminMemberResDto> editMember(@RequestBody AdminMemberReqDto member, Authentication authentication) {
		AdminMemberResDto adminMemberResDto = adminService.editMember(member, authentication);
		return ResponseEntity.ok(adminMemberResDto);
	}
	
	@PostMapping("/upload/{type}")
	public ResponseEntity<Boolean> uploadFile(@PathVariable String type, MultipartFile file, Authentication authentication) {
		return ResponseEntity.ok(adminService.uploadJson(type, file, authentication));
	}
	
	
	
}
