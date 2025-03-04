package com.kh.back.controller;
import com.fasterxml.jackson.databind.ObjectMapper;
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
	
	@GetMapping("/myinfo")
	public ResponseEntity<ReduxResDto> myinfo(@RequestHeader("Authorization") String token) {
		return ResponseEntity.ok(reduxService.getMyInfo(token));
	}
}

