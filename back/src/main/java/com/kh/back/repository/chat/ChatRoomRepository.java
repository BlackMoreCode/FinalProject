package com.kh.back.repository.chat;

import com.kh.back.entity.chat.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom,String> {
    List<ChatRoom> findAllByOrderByRegDateAsc();

    // 로그인한 회원이 포함된 채팅방 목록 조회
    @Query("SELECT cr FROM ChatRoom cr JOIN cr.chatMember cm WHERE cm.member.memberId = :memberId")
    List<ChatRoom> findChatRoomsByMemberId(@Param("memberId") Long memberId);
}
