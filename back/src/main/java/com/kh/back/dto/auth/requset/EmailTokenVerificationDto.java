package com.kh.back.dto.auth.requset;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@Setter
@NoArgsConstructor

public class EmailTokenVerificationDto {
    private String email;
    private String inputToken;
}
