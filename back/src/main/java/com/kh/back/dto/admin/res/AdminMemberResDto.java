package com.kh.back.dto.admin.res;

import lombok.*;

@Getter @Setter @ToString
@AllArgsConstructor @NoArgsConstructor
public class AdminMemberResDto {
	private Long id;
	private String name;
	private String email;
	private String phone;
	
}
