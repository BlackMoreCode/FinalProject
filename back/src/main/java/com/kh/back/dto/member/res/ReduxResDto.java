package com.kh.back.dto.member.res;

import com.kh.back.constant.Authority;
import lombok.*;

import java.util.Set;

@Getter @Setter @ToString
@AllArgsConstructor @NoArgsConstructor
public class ReduxResDto {
	Long id;
	String email;
	String nickname;
	Authority role;
	private Set<String> likedRecipes; // 좋아요 레시피 ID 리스트
	private Set<String> reportedRecipes; // 신고 레시피 ID 리스트

}
