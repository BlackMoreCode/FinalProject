package com.kh.back.dto.faq.res;

import lombok.*;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class FaqResDto {
	private String id;
	private String title;
	private String content;
}
