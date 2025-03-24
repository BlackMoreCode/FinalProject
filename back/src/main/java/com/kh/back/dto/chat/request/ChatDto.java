package com.kh.back.dto.chat.request;

import com.kh.back.constant.MsgType;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @ToString
@NoArgsConstructor @AllArgsConstructor
public class ChatDto {
	private MsgType type;
	private Long id;
	private String roomId;
	private Long memberId;
	private String msg;
	private String img;
	//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSS")
	private LocalDateTime regDate;
}
