package com.kh.back.service;

import com.kh.back.dto.PurchaseRecordDto;
import com.kh.back.entity.PurchaseRecord;
import com.kh.back.entity.member.Member;
import com.kh.back.entity.member.PaymentStatus;
import com.kh.back.repository.PurchaseRecordRepository;
import com.kh.back.repository.member.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
public class PurchaseService {

    private final MemberRepository memberRepository;
    private final PurchaseRecordRepository purchaseRecordRepository;

    public PurchaseService(MemberRepository memberRepository, PurchaseRecordRepository purchaseRecordRepository) {
        this.memberRepository = memberRepository;
        this.purchaseRecordRepository = purchaseRecordRepository;
    }

    public PurchaseRecord savePurchase(Authentication authentication, PurchaseRecordDto recordDto) {

        // 로그인한 사용자 정보 얻기
        Long userId = Long.valueOf(authentication.getName());

        // 회원정보 가져오기
        Member member = memberRepository.findByMemberId(userId)
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));


        // PurchaseRecord 엔티티 생성
        PurchaseRecord purchaseRecord = PurchaseRecord.builder()
                .orderId(recordDto.getOrderId()) // recordDto에서 데이터를 가져옵니다.
                .orderName(recordDto.getOrderName())
                .amount(recordDto.getAmount())
                .customerName(recordDto.getCustomerName())
                .customerEmail(recordDto.getCustomerEmail())
                .purchaseDate(LocalDateTime.now()) // 결제 날짜는 현재 시간으로 설정
                .member(member) // 로그인한 사용자 설정
                .build();

        // 데이터베이스에 저장 후 반환
        return purchaseRecordRepository.save(purchaseRecord);
    }

    public boolean isMemberPurchase (Authentication authentication) {
        // 로그인한 사용자 정보 얻기
        Long userId = Long.valueOf(authentication.getName());

        // 회원정보 가져오기
        Member member = memberRepository.findByMemberId(userId)
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));

        // 해당 멤버의 구매 기록이 존재하는지 확인
        return purchaseRecordRepository.existsByMember(member);
    }

    /**
     * 회원이 프리미엄 회원인지 확인하는 메서드.
     * 구매 기록이 존재하면 프리미엄 회원으로 간주합니다.
     *
     * @param memberId 조회할 회원의 ID
     * @return 프리미엄 회원이면 true, 아니면 false
     */
    public boolean isMemberPremium(Long memberId) {
        // 회원 정보 조회
        Member member = memberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));
        // 해당 회원의 구매 기록이 존재하는지 확인 (구매 기록이 있으면 프리미엄 회원)
        return purchaseRecordRepository.existsByMember(member);
    }
}
