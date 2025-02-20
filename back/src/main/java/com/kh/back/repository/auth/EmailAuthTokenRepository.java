package com.kh.back.repository.auth;


import com.kh.back.entity.auth.email_auth_token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailAuthTokenRepository extends JpaRepository<email_auth_token, Long> {
    Optional<email_auth_token> findByEmail(String email);
    void deleteByEmail(String email);  // 이메일로 토큰 삭제
}
