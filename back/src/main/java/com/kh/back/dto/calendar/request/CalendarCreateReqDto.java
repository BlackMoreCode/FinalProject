package com.kh.back.dto.calendar.request;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class CalendarCreateReqDto {
	private String recipeId;
	private LocalDate date;
	private String memo;
	private String amount;
	private String category;
}
