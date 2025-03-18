package com.kh.back.dto.admin.res;

import com.kh.back.constant.Authority;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @ToString
@AllArgsConstructor @NoArgsConstructor
public class AdminMemberResDto {
	private Long id;
	private String email;
	private String nickname;
	private String phone;
	private String memberImg;
	private String introduce;
	private LocalDateTime regDate;
	private Authority authority;
}
