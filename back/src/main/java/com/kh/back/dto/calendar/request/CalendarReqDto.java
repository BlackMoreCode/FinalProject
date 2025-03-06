package com.kh.back.dto.calendar.request;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CalendarReqDto {
	private Long memberId;      // 필수
	private LocalDate start;    // 선택 (날짜 범위 조회)
	private LocalDate end;      // 선택 (날짜 범위 조회)
	private String recipeId;    // 선택 (레시피 필터)
}

