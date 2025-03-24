package com.kh.back.entity.chat;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.kh.back.entity.member.Member;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "chat")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;
    
    // 전송 내용
    @Column(name = "msg")
    private String msg;

    // 전송 시간
    @Column(name = "sent_at")
    private LocalDateTime regDate;

    // 채팅방 id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    @JsonIgnore
    private ChatRoom chatRoom;
}
