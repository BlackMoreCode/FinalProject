package com.kh.back.dto.calendar.request;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class CalendarUpdateReqDto {
	Long id;
	String recipeId;
	String memo;
	String amount;
	LocalDate date;
	String category;
}
