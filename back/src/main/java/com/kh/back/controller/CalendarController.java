package com.kh.back.controller;

import com.kh.back.dto.calendar.request.CalendarCreateReqDto;
import com.kh.back.dto.calendar.request.CalendarReqDto;
import com.kh.back.dto.calendar.request.CalendarUpdateReqDto;
import com.kh.back.dto.calendar.res.CalendarResDto;
import com.kh.back.dto.calendar.res.TopRatedResDto;
import com.kh.back.service.member.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/cal")
@CrossOrigin("http:localhost:3000")
@RequiredArgsConstructor
public class CalendarController {
	private final CalendarService calendarService;
	
	
	@PostMapping("/public/list")
	public ResponseEntity<List<CalendarResDto>> getCalendar(@RequestBody CalendarReqDto calendarReqDto) {
		return ResponseEntity.ok(calendarService.getCalendarByFilter(calendarReqDto));
	}
	
	@GetMapping("/exists/{date}/{recipeId}")
	public ResponseEntity<Boolean> existsCalendar(@PathVariable LocalDate date, @PathVariable String recipeId, Authentication authentication) {
		return ResponseEntity.ok(calendarService.existsCalendar(recipeId, date, authentication ));
	}
	
	@PostMapping("/create")
	public ResponseEntity<Boolean> createCalendar(@RequestBody CalendarCreateReqDto calendarCreateReqDto, Authentication authentication) {
		return ResponseEntity.ok(calendarService.createCalendar(calendarCreateReqDto, authentication));
	}
	
	@PostMapping("/update")
	public ResponseEntity<Boolean> updateCalendar(@RequestBody CalendarUpdateReqDto calendarUpdateReqDto, Authentication authentication) {
		return ResponseEntity.ok(calendarService.updateCalendar(calendarUpdateReqDto, authentication));
	}
	
	@GetMapping("/public/top/{type}")
	public ResponseEntity<List<TopRatedResDto>> getTopRecipe(@PathVariable String type) {
		return ResponseEntity.ok(calendarService.getTop3RecipeByIndex(type));
	}
}
