package com.kh.back.dto.admin.res;

import lombok.*;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class ChartResDto {
	String name;
	Long view;
	Long like;
	String id;
}
