package com.kh.back.dto.faq.request;

import lombok.*;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class FaqReqDto {
	private String title;
	private String content;
}
