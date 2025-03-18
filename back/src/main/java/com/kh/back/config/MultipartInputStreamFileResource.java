package com.kh.back.config;

import org.springframework.core.io.InputStreamResource;
import java.io.IOException;
import java.io.InputStream;

public class MultipartInputStreamFileResource extends InputStreamResource {
	private final String filename;
	
	public MultipartInputStreamFileResource(InputStream inputStream, String filename) {
		super(inputStream);
		this.filename = filename;
	}
	
	@Override
	public String getFilename() {
		return this.filename;
	}
	
	@Override
	public long contentLength() throws IOException {
		return -1; // 파일 크기를 알 수 없을 때 사용 (RestTemplate에서 문제 없음)
	}
}

