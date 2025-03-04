package com.kh.back.repository;


import com.kh.back.constant.Authority;
import com.kh.back.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
	boolean existsByEmail(String email);
	
	boolean existsByPhone(String phone);
	
	Optional<Member> findByEmail(String email);
	
	Optional<Member> findByUserId(String userId);
	
	boolean existsByNickName(String nickName);
	
	
	Optional<Member> findByNickName(String nickName);
	
	Optional<Member> findById(Long id);
	
	Optional<Member> findByAuthority(Authority authority);
	
	Optional<Member> findByPhone(String phone);
	
	Optional<Member> findByMemberId(Long memberId);
	List<Member> findAllByAuthority(Authority authority);

}