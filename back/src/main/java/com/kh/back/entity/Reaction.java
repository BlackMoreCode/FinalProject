package com.kh.back.entity;

import com.kh.back.constant.Action;
import com.kh.back.entity.member.Member;
import lombok.*;
import javax.persistence.*;

@Entity
@Table(name = "custom_style")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Reaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private String postId;


    @Enumerated(EnumType.STRING)
    private Action action; // LIKE 또는 REPORT

    public Reaction(Member member, String postId, Action action) {
        this.member = member;
        this.postId = postId;
        this.action = action;
    }
}

