package com.kh.back.controller;


import com.kh.back.dto.chat.request.ChatDto;
import com.kh.back.dto.chat.request.ChatRoomReqDto;
import com.kh.back.dto.chat.res.ChatRoomResDto;
import com.kh.back.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/chat")
public class ChatController {
    private final ChatService chatService;

    //채팅방 생성
    @PostMapping("/new")
    public ResponseEntity<String> createRoom(@RequestBody ChatRoomReqDto chatRoomReqDto, Authentication auth) {
        if (chatRoomReqDto.getName().length() > 20) {
            return ResponseEntity.badRequest().body("채팅방 이름은 20자 이하로 입력해주세요.");
        }
        if (chatRoomReqDto.getPersonCnt() > 30) {
            return ResponseEntity.badRequest().body("참여 가능 인원은 최대 30명입니다.");
        }
        ChatRoomResDto room = chatService.createRoom(chatRoomReqDto, auth);
        return ResponseEntity.ok(room.getRoomId());
    }

    //채팅방 리스트
    @GetMapping("/roomList")
    public ResponseEntity<List<ChatRoomResDto>> findByRoomList() {
        List<ChatRoomResDto> rooms = chatService.findRoomList();
        return ResponseEntity.ok(rooms);
    }

    // 참여중인 채팅방 리스트
    @GetMapping("/myRooms")
    public ResponseEntity<List<ChatRoomResDto>> getChatRoomsByMemberId(Authentication auth) {
        List<ChatRoomResDto> chatRooms = chatService.getChatRoomsByMemberId(auth);
        return ResponseEntity.ok(chatRooms);
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomResDto>> findByRooms() {
        List<ChatRoomResDto> rooms = chatService.findAllRoom();
        return ResponseEntity.ok(rooms);
    }

    // 방 정보 가져오기
    @GetMapping("/room/{roomId}")
    public ResponseEntity<ChatRoomResDto> findRoomById(@PathVariable String roomId) {
        log.info("Requested roomId : {}", roomId);
        try {
            ChatRoomResDto room = chatService.findRoomById(roomId);
            if (room != null) {
                log.info("채팅방 정보 가져가기 : {}", room);
                return ResponseEntity.ok(room);
            } else {
                log.warn("채팅방을 ID로 찾을 수 없음: {}", roomId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("채팅방 정보 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/cntRoomMember/{roomId}")
    public ResponseEntity<Integer> cntRoomMember(@PathVariable String roomId) {
        try {
            int memberCnt = chatService.cntOfRoomMember(roomId);
            log.info("채팅방Id : {}, 입장 회원 수 : {}", roomId, memberCnt);
            return ResponseEntity.ok(memberCnt);
        } catch (Exception e) {
            log.error("채팅방 회원 수 반환 중 오류 : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 메시지 저장하기
    @PostMapping("/saveMessage")
    public ResponseEntity<ChatDto> saveMessage(@RequestBody ChatDto chatMsgDto) {
        chatService.saveMsg(chatMsgDto.getRoomId(), chatMsgDto.getMemberId(), chatMsgDto.getMsg());
        return ResponseEntity.ok(chatMsgDto);
    }

    // 채팅 내역 리스트
    @GetMapping("/message/{roomId}")
    public ResponseEntity<List<ChatDto>> findAll(@PathVariable String roomId) {
        return ResponseEntity.ok(chatService.findAllChatting(roomId));
    }

    // 채팅방 삭제
    @DeleteMapping("/delRoom/{roomId}")
    public ResponseEntity<Boolean> removeRoom(@PathVariable String roomId) {
        boolean isTrue = chatService.removeRoom(roomId);
        return ResponseEntity.ok(isTrue);
    }
    
    @GetMapping("/public/bot/{message}")
    public ResponseEntity<List<Map<String, String>>> getBotAns(@PathVariable String message) {
        return ResponseEntity.ok(chatService.getBotResponse(message));
    }
}
