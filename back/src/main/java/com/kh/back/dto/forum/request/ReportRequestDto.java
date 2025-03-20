package com.kh.back.dto.forum.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportRequestDto {
    private Integer reporterId;
    private String reason;
}