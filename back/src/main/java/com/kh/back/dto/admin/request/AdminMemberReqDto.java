package com.kh.back.dto.admin.request;

import lombok.*;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class AdminMemberReqDto {
	private Long memberId;
	private Boolean memberImg;
	private Boolean introduce;
	private String authority;
}
