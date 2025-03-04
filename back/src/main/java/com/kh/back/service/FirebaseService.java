package com.kh.back.service;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class FirebaseService {

    public String uploadImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            System.out.println("파일이 없거나 비어 있음");
            throw new IllegalArgumentException("파일이 없습니다.");
        }
        System.out.println("파일 이름: " + file.getOriginalFilename());

        Bucket bucket = StorageClient.getInstance().bucket();
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Blob blob = bucket.create(fileName, file.getBytes(), file.getContentType());
        return blob.getMediaLink();
    }
}