package com.kh.back.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.back.constant.MsgType;
import com.kh.back.dto.chat.request.ChatDto;
import com.kh.back.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Slf4j
@Component
//WebSocketHandler 를 상속받아 WebSocketHandler 를 구현
public class WebSocketHandler extends TextWebSocketHandler {
	private final ObjectMapper objectMapper; //JSON 문자열로 변환하기 위한 객체
	private final ChatService chatService; // 채팅방 관련 비즈니스 로직을 처리할 서비스
	private final Map<WebSocketSession, String> sessionRoomIdMap = new ConcurrentHashMap<>();
	@Override
	//클라이언트가 서버로 연결을 시도할 때 호출
	protected void handleTextMessage(WebSocketSession session, TextMessage msg) {
		try {
			String payload = msg.getPayload();
			log.warn("payload : {}", payload);
			// JSON 문자열을 ChatMessageDto 변환 작업
			ChatDto chatMsg = objectMapper.readValue(payload, ChatDto.class);
			String roomId = chatMsg.getRoomId();

			if (chatMsg.getType() == MsgType.ENTER) {
				sessionRoomIdMap.put(session, chatMsg.getRoomId());
				chatService.addSessionAndHandlerEnter(roomId, session, chatMsg);
			} else if (chatMsg.getType() == MsgType.CLOSE) {
				chatService.removeSessionAndHandleExit(roomId, session, chatMsg);
			} else {
				chatService.sendMsgToAll(roomId, chatMsg);
				chatService.saveMsg(chatMsg.getRoomId(), chatMsg.getMemberId(), chatMsg.getMsg());
			}
		} catch (Exception e) {
			log.error("handleTextMessage에서 에러 발생", e);
		}
	}
	@Override
	public void afterConnectionClosed( WebSocketSession session, CloseStatus status) {
		//세션과 매핑된 채팅방 ID 가져오기
		try {
			log.error("연결 해제 이후 동작(채팅방 종료) : {}", session);
			String roomId = sessionRoomIdMap.remove(session);
			if (roomId != null) {
				ChatDto chatMsg = new ChatDto();
				chatMsg.setType(MsgType.CLOSE);
				chatService.removeSessionAndHandleExit(roomId, session, chatMsg);
			}
		} catch (Exception e) {
			log.error("채팅방 종료 에러", e);
		}
	}
}