package com.kh.back.repository;

import com.kh.back.entity.PurchaseRecord;
import com.kh.back.entity.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRecordRepository extends JpaRepository<PurchaseRecord, Long> {
    // 필요한 쿼리 메서드 추가
    boolean existsByMember(Member member);
}