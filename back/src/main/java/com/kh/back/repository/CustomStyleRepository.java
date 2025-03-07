package com.kh.back.repository;

import com.kh.back.entity.CustomStyle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomStyleRepository extends JpaRepository<CustomStyle, Long> {

    // 특정 회원(Member)의 커스텀 스타일 조회 (회원 ID 기준)
    Optional<CustomStyle> findByMember_MemberId(Long memberId);
}