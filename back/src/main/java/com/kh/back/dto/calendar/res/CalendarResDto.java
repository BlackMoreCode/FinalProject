package com.kh.back.dto.calendar.res;

import com.kh.back.constant.Recipe;
import lombok.*;

import java.time.LocalDate;

@Getter @Setter @ToString @Builder
@AllArgsConstructor @NoArgsConstructor
public class CalendarResDto {
	private Long calendarId;
	private Long memberId;
	private String recipeId;
	private Recipe recipe;
	private LocalDate date;
	private String amount;
	private String memo;
}
