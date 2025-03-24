package com.kh.back.service;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.kh.back.dto.chat.request.ChatDto;
import com.kh.back.dto.chat.request.ChatRoomReqDto;
import com.kh.back.dto.chat.res.ChatRoomResDto;
import com.kh.back.entity.member.Member;
import com.kh.back.entity.chat.Chat;
import com.kh.back.entity.chat.ChatMember;
import com.kh.back.entity.chat.ChatRoom;
import com.kh.back.repository.member.MemberRepository;
import com.kh.back.repository.chat.ChatMemberRepository;
import com.kh.back.repository.chat.ChatRepository;
import com.kh.back.repository.chat.ChatRoomRepository;
import com.kh.back.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChatService {
    private final ObjectMapper objectMapper; // JSON 문자열로 변환하기 위한 객체
    private final MemberService memberService;
    private Map<String, ChatRoomResDto> chatRooms; // 채팅방 정보를 담을 맵
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRepository chatRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final MemberRepository memberRepository;

    @PostConstruct // 의존성 주입 이후 초기화 수행하는 메소드
    private void init() {
        chatRooms = chatRoomRepository.findAll()
                .stream()
                .collect(Collectors.toMap(ChatRoom::getId, this::convertEntityToRoomDto));
    }

    public List<ChatRoomResDto> findAllRoom() {
        return new ArrayList<>(chatRooms.values());
    }

    // 채팅방 리스트 반환
    public List<ChatRoomResDto> findRoomList() {
        List<ChatRoomResDto> chatRoomResDtoList = new ArrayList<>();
        for (ChatRoom chatRoom : chatRoomRepository.findAllByOrderByRegDateAsc()) {
            ChatRoomResDto chatRoomDto = convertEntityToRoomDto(chatRoom);
            chatRoomResDtoList.add(chatRoomDto);
        }
        return chatRoomResDtoList;
    }

    // 참여중인 채팅방 리스트
    public List<ChatRoomResDto> getChatRoomsByMemberId(Authentication auth) {
        // ChatRoom 엔티티 리스트를 가져옴
        Member member = memberService.convertAuthToEntity(auth);
        List<ChatRoom> chatRooms = chatRoomRepository.findChatRoomsByMemberId(member.getMemberId());

        // ChatRoom 엔티티를 ChatRoomResDto로 변환
        return chatRooms.stream()
                .map(this::convertEntityToRoomDto)
                .collect(Collectors.toList());
    }

    // 채팅방에 입장한 회원 수 반환
    public int cntOfRoomMember(String roomId) {
        try {
            int memberCnt = chatMemberRepository.cntRoomMember(roomId);
            log.info("채팅방Id : {}, 입장 회원 수 : {}", roomId, memberCnt);
            return memberCnt;
        } catch (Exception e) {
            log.error("채팅방 회원 수 반환 중 오류 : {}", e.getMessage());
            throw new RuntimeException("채팅방 회원 수 반환 중 오류");
        }
    }

    // 채팅방 가져오기
    public ChatRoomResDto findRoomById(String roomId) {
        ChatRoomResDto room = chatRooms.get(roomId);
        if (room == null) {
            throw new RuntimeException("해당 채팅방이 존재하지 않습니다: " + roomId);
        }
        return room;
    }

    // 방 개설하기
    public ChatRoomResDto createRoom(ChatRoomReqDto chatRoomDto, Authentication auth) {
        String randomId = UUID.randomUUID().toString();
        log.info("UUID : {}", randomId);

        ChatRoom chatRoomEntity = new ChatRoom(); //ChatRoom엔티티 객체 생성(채팅방 정보db저장 하려고)
        ChatRoomResDto chatRoom = ChatRoomResDto.builder()
                .roomId(randomId)
                .name(chatRoomDto.getName())
                .regDate(LocalDateTime.now())
                .personCnt(chatRoomDto.getPersonCnt())
                .build();
        chatRoomEntity.setId(randomId);
        chatRoomEntity.setRoomName(chatRoomDto.getName());
        chatRoomEntity.setRegDate(LocalDateTime.now());
        chatRoomEntity.setRoomType(chatRoomDto.getRoomType());
        chatRoomEntity.setPersonCnt(chatRoomDto.getPersonCnt());
        chatRoomRepository.save(chatRoomEntity);

        chatRooms.put(randomId, chatRoom);
        log.debug("현재 chatRooms: {}", chatRooms);
        return chatRoom;
    }

    // 전체 채팅 내역
    public List<ChatDto> findAllChatting(String roomId) {
        List<Chat> chat = chatRepository.findRecentMsg(roomId);
        List<ChatDto> chatMsgDtos = new ArrayList<>();
        for (Chat chat1 : chat) {
            chatMsgDtos.add(convertEntityToChatDto(chat1));
        }
        return chatMsgDtos;
    }

    // 채팅방 삭제
    public boolean removeRoom(String roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(
                        () -> new RuntimeException("해당 채팅방이 존재하지 않습니다.1")
                );

        // 채팅방에 남아있는 회원 수 확인
        int memberCount = cntOfRoomMember(roomId);

        // 채팅방에 회원이 없으면 삭제
        if (memberCount == 0) {
            chatRooms.remove(roomId); // 메모리에서 제거
            chatRoomRepository.delete(chatRoom); // DB에서 제거
            return true;
        }
        return false;
    }

    // 채팅방에 입장한 세션 추가
    public void addSessionAndHandlerEnter(String roomId, WebSocketSession session, ChatDto chatMessage) {
        ChatRoomResDto room = findRoomById(roomId);
        if (room != null) {
            room.getSessions().add(session);    // 채팅방에 입장한 세션을 추가
            log.debug("새로운 세션 추가");

            Member member = memberRepository.findById(chatMessage.getMemberId()).orElseThrow(
                    () -> new RuntimeException("해당 멤버 없음")
            );
            ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("해당 채팅방 없음"));

            Optional<ChatMember> existingChatMember = chatMemberRepository.findByMemberAndChatRoom(member, chatRoom);
            if (existingChatMember.isEmpty()) {
                ChatMember chatMember = new ChatMember();
                chatMember.setMember(member);
                chatMember.setChatRoom(chatRoom);

                chatMemberRepository.save(chatMember);
            } else {
                log.info("이미 참여한 채팅방 멤버입니다.");
            }
        }
    }
    
    public void removeSessionAndHandleExit(String roomId, WebSocketSession session, ChatDto chatMessage) {
        ChatRoomResDto room = findRoomById(roomId);
        if (room == null) {
            log.warn("채팅방을 찾을 수 없음: {}", roomId);
            return;
        }
        
        room.getSessions().remove(session);
        log.debug("세션 제거됨 : {}", session);
        
        if (chatMessage.getMemberId() == null) {
            log.warn("퇴장 요청에 memberId가 없음");
            return;
        }
        
        Member member = memberRepository.findById(chatMessage.getMemberId()).orElse(null);
        if (member == null) {
            log.warn("해당 멤버를 찾을 수 없음: {}", chatMessage.getMemberId());
            return;
        }
        
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElse(null);
        if (chatRoom == null) {
            log.warn("해당 채팅방을 찾을 수 없음: {}", roomId);
            return;
        }
        
        boolean chatMemberDeleted = chatMemberRepository.findByMemberAndChatRoom(member, chatRoom)
            .map(chatMember -> {
                chatMemberRepository.delete(chatMember);
                log.debug("ChatMember 삭제: member = {}, chatRoom = {}", member.getNickName(), chatRoom.getId());
                return true;
            }).orElse(false);
        
        if (room.isSessionEmpty() || chatMemberDeleted) {
            removeRoom(roomId);
        }
    }
    
    
    public void sendMsgToAll(String roomId, ChatDto msg) {
        ChatRoomResDto room = findRoomById(roomId);
        if (room != null) {
            for (WebSocketSession session : room.getSessions()) {
                // 해당 세션에 메시지 발송
                sendMsg(session, msg);  // 채팅 메세지를 보내는 메소드
            }
        }
    }

    public <T> void sendMsg(WebSocketSession session, T msg) {
        try {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(msg)));
        }catch (IOException e) {
            log.error("메시지 전송 실패 : {}", e.getMessage());
        }
    }
    
    public List<Map<String, String>> getBotResponse(String message) {
        try {
            log.warn("입력값 확인 : {}", message);
            String flaskBotUrl = "http://localhost:5001";
            // Flask API에 GET 요청을 보낼 URL 생성
            String url = UriComponentsBuilder.fromHttpUrl(flaskBotUrl)
                .path("/bot")
                .queryParam("message", message)
                .toUriString();
            
            // RestTemplate을 사용하여 Flask API에 GET 요청
            RestTemplate restTemplate = new RestTemplate();
            
            // 요청 헤더 설정 (UTF-8)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAcceptCharset(java.util.Collections.singletonList(java.nio.charset.StandardCharsets.UTF_8));
            
            // HttpEntity 생성 (헤더를 포함한 요청)
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            // 응답을 Map<String, Object> 타입으로 받기 위해 ParameterizedTypeReference 사용
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            // 응답에서 "results"만 추출
            Map<String, Object> responseBody = response.getBody();
            log.warn("플라스크 확인 : {}", responseBody);
            if (responseBody != null && responseBody.containsKey("results")) {
                return (List<Map<String, String>>) responseBody.get("results");
            } else {
                throw new RuntimeException("결과가 존재하지 않습니다.");
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Flask 서버 호출 실패: " + e.getMessage(), e);
        }
    }
    // 채팅 메세지 DB 저장
    public void saveMsg(String roomId, Long memberId, String msg) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("해당 채팅방이 존재하지 않습니다."));
        Member member  = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다."));
        Chat chatMsg = new Chat();
        chatMsg.setChatRoom(chatRoom);
        chatMsg.setMsg(msg);
        chatMsg.setMember(member);
        chatMsg.setRegDate(LocalDateTime.now(ZoneId.of("Asia/Seoul")));
        chatRepository.save(chatMsg);
        log.warn("DB에 채팅 저장");
    }

    // ChatRoom 엔티티 Dto로 변환
    private ChatRoomResDto convertEntityToRoomDto(ChatRoom chatRoom) {
        ChatRoomResDto chatRoomResDto = new ChatRoomResDto();
        chatRoomResDto.setRoomId(chatRoom.getId());
        chatRoomResDto.setName(chatRoom.getRoomName());
        chatRoomResDto.setRegDate(chatRoom.getRegDate());
        chatRoomResDto.setRoomType(chatRoom.getRoomType());
        chatRoomResDto.setPersonCnt(chatRoom.getPersonCnt());
        return chatRoomResDto;
    }

    // Chat 엔티티 Dto로 변환
    private ChatDto convertEntityToChatDto(Chat chat) {
        ChatDto chatMsgDto = new ChatDto();
        chatMsgDto.setId(chat.getId());
        chatMsgDto.setRoomId(chat.getChatRoom().getId());
        chatMsgDto.setMemberId(chat.getMember().getMemberId());
        chatMsgDto.setImg(chat.getMember().getMemberImg());
        chatMsgDto.setMsg(chat.getMsg());
        chatMsgDto.setRegDate(chat.getRegDate());
        return chatMsgDto;
    }
}