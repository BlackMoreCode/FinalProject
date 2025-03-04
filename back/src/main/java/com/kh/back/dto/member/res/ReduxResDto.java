package com.kh.back.dto.member.res;

import com.kh.back.constant.Authority;
import lombok.*;

@Getter @Setter @ToString
@AllArgsConstructor @NoArgsConstructor
public class ReduxResDto {
	Long id;
	String email;
	String nickname;
	Authority role;
}
