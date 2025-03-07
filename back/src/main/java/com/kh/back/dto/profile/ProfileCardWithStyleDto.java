package com.kh.back.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileCardWithStyleDto {

    private String nickName;
    private String memberImg;
    private String introduce;

    // 스타일 정보 추가
    private String bgColor;
    private String nicknameFont;
    private String nicknameSize;
    private String introduceFont;
    private String introduceSize;
    private String textColorNickname;
    private String textColorIntroduce;
}