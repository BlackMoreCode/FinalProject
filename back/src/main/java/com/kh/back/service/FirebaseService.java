package com.kh.back.service;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.UUID;

@Service
public class FirebaseService {

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

    public String uploadProfileImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("파일이 없습니다.");
        }

        // 프로필 이미지 저장 경로 설정
        String folderName = "profile/" ;

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

        return blob.getMediaLink();
    }
}
