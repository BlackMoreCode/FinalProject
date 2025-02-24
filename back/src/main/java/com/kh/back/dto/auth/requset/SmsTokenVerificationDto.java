package com.kh.back.dto.auth.requset;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class SmsTokenVerificationDto {
    private String phone;
    private String inputToken;

}
