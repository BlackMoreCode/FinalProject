    package com.kh.back.dto.auth;

    import com.kh.back.constant.Authority;
    import com.kh.back.entity.member.Member;
    import lombok.*;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.web.multipart.MultipartFile;

    import java.time.LocalDateTime;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public class SignupDto {
        private String email;
        private String pwd;
        private String name;
        private String phone;
        private String nickname;
        private MultipartFile memberImg;





        public Member toEntity(PasswordEncoder passwordEncoder, String imagePath) {
            return Member.builder()
                    .email(email)
                    .pwd(passwordEncoder.encode(pwd))
                    .nickName(nickname)
                    .name(name)
                    .phone(phone)
                    .regDate(LocalDateTime.now()) // 가입 날짜 자동 설정
                    .authority(Authority.ROLE_USER) // 기본 권한 설정
                    .memberImg(imagePath)
                    .build();
        }

        public UsernamePasswordAuthenticationToken toAuthentication() {
            return new UsernamePasswordAuthenticationToken(email, pwd);
        }
    }

