package com.kh.back.service;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import com.kh.back.entity.member.Member;
import com.kh.back.repository.member.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
public class FirebaseService {

    private final MemberRepository memberRepository;

    public FirebaseService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    // 이미지 리사이징, 압축 후 레시피 이름 폴더로 업로드
    public String uploadImage(MultipartFile file, String recipeName) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("파일이 없습니다.");
        }

        // 레시피 이름을 폴더명으로 사용 (공백 제거)
        String folderName = "recipes/" + recipeName.replaceAll("\\s+", "_");

        // 파일을 BufferedImage로 변환
        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        // 400x400으로 리사이징
        BufferedImage resizedImage = new BufferedImage(400, 400, originalImage.getType());
        Graphics2D g = resizedImage.createGraphics();
        g.drawImage(originalImage, 0, 0, 400, 400, null);
        g.dispose();


        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, "jpg", outputStream);
        byte[] imageBytes = outputStream.toByteArray();

        // Firebase Storage에 업로드
        Bucket bucket = StorageClient.getInstance().bucket();
        String fileName = folderName + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename(); // 폴더 경로 추가
        Blob blob = bucket.create(fileName, imageBytes, "image/jpeg");

        return blob.getMediaLink();
    }

    public static String uploadProfileImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("파일이 없습니다.");
        }

        // 프로필 이미지 저장 경로 설정
        String folderName = "profile" ;

        // 파일을 BufferedImage로 변환
        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        // 400x400으로 리사이징
        BufferedImage resizedImage = new BufferedImage(400, 400, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = resizedImage.createGraphics();
        g.drawImage(originalImage, 0, 0, 400, 400, null);
        g.dispose();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, "jpg", outputStream);
        byte[] imageBytes = outputStream.toByteArray();

        // Firebase Storage에 업로드
        Bucket bucket = StorageClient.getInstance().bucket();
        String fileName = folderName + "/" + UUID.randomUUID() + "_profile.jpg"; // 파일명 고유값 추가
        Blob blob = bucket.create(fileName, imageBytes, "image/jpeg");

        String filePath = blob.getName(); // 저장된 파일 경로
        log.info("파일이 저장된 경로: {}", filePath);

        return blob.getMediaLink();
    }

    // 이미지 업로드 및 DB 저장
//    @Transactional
//    public void saveImageUrl(MultipartFile file, Authentication authentication) throws IOException {
//        // 인증된 유저 가져오기
//        Long memberId = Long.valueOf(authentication.getName());
//        Member member = memberRepository.findById(memberId)
//                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));
//
//        // 파이어베이스에 업로드하고 URL 반환
//        String imageUrl = uploadProfileImage(file);
//        log.info("저장하려는 유저 id값 {}", member.getMemberId());
//        log.info("저장하려는 유저 이름 {}", member.getName());
//        log.info("저장하려는 이미지 url 주소값 : {}", imageUrl);
//
//        // DB에 이미지 URL 저장
//        member.setMemberImg(imageUrl);
//        memberRepository.save(member);  // 다시 저장
//        memberRepository.flush();
//        log.info("DB에 반영된 이미지 URL: {}", member.getMemberImg());
//
//    }

    // 본인 프로필 이미지 가져오기
    public String getProfileImage(Authentication authentication) {
        Long memberId = Long.valueOf(authentication.getName());
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));
        return member.getMemberImg();
    }

    // 특정 유저 프로필 이미지 가져오기
    public String getMemberProfileImage(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));
        return member.getMemberImg();
    }



}
