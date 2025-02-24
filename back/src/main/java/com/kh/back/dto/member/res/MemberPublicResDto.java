package com.kh.back.dto.member.res;

import lombok.*;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class MemberPublicResDto {
	private Long id;
	private String email;
	private String status;
}
