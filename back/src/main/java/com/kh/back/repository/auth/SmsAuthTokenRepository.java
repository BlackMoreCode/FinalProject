package com.kh.back.repository.auth;

import com.kh.back.entity.auth.SmsAuthToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SmsAuthTokenRepository extends JpaRepository<SmsAuthToken, Long> {
    Optional<SmsAuthToken> findByPhone(String phone);
    void deleteByPhone(String phone);
}
