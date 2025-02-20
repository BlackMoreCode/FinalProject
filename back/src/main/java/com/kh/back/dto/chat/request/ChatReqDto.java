package com.kh.back.dto.chat.request;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class ChatReqDto {
	public enum MsgType {
		ENTER, TALK, CLOSE
	}
	private MsgType type;
	private Long id;
	private String roomId;
	private String profile;
	private String nickName;
	private String sender;
	private String msg;
	//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSS")
	private LocalDateTime regDate;
}
