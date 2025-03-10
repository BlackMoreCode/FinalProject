package com.kh.back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PurchaseRecordDto {
    private String orderId; // 주문 아이디 (고유값)
    private String orderName; // 상품명
    private int amount; // 결제 금액
    private String customerName; // 구매자 이름
    private String customerEmail; // 구매자 이메일
}
