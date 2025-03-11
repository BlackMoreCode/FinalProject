package com.kh.back.entity;

import com.kh.back.entity.member.Member;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderId; // 주문 아이디 (고유값)

    private String orderName; // 상품명

    private int amount; // 결제 금액

    private String customerName; // 구매자 이름

    private String customerEmail; // 구매자 이메일

    @Column(nullable = false)
    private LocalDateTime purchaseDate; // 결제 날짜

    @OneToOne
    @JoinColumn(name = "member_id")
    private Member member;


}
