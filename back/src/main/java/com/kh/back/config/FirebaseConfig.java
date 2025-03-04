package com.kh.back.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            // 클래스패스에서 JSON 파일을 로드 (절대경로 X)
            InputStream serviceAccount = getClass().getClassLoader()
                    .getResourceAsStream("finalproject-99667-firebase-adminsdk-fbsvc-9ad17156a0.json");

            if (serviceAccount == null) {
                throw new IOException("Firebase 인증 키 파일을 찾을 수 없습니다.");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setStorageBucket("finalproject-99667.firebasestorage.app")
                    .build();

            // 동기화 블록을 사용해 멀티스레드 환경에서 안전하게 초기화
            synchronized (this) {
                if (FirebaseApp.getApps().isEmpty()) {
                    FirebaseApp.initializeApp(options);
                    log.info("Firebase가 성공적으로 초기화되었습니다.");
                } else {
                    log.info("Firebase는 이미 초기화되어 있습니다.");
                }
            }

        } catch (IOException e) {
            log.error("Firebase 초기화 중 오류 발생: ", e);
        }
    }
}
