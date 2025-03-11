package com.kh.back.dto.member.res;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberInfoDto {
    private Long memberId; // 맴버 아이디
    private String name; // 이름
    private String nickName; // 닉네임
    private String email; // 이메일
    private String phone; // 전화번호
    private String introduce; // 자기소개
}
