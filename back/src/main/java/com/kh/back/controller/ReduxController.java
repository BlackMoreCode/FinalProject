package com.kh.back.controller;
import com.kh.back.dto.member.res.ReduxResDto;
import com.kh.back.service.redux.ReduxService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/redux")
@RequiredArgsConstructor
public class ReduxController {
	private final ReduxService reduxService;
	
	@GetMapping("/myinfo")
	public ResponseEntity<ReduxResDto> myInfo(Authentication auth) {
		return ResponseEntity.ok(reduxService.getMyInfo(auth));
	}
}

