package com.kh.back.entity;



import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Comment {


    @Id
    @Column(name = "comment_id")
    @GeneratedValue(strategy = GenerationType.AUTO) //JPA 가 자동으로 생성 전략을 정함
    private Long commentId;

    private String recipeId; // 레시피와 연관관계

    @ManyToOne(fetch = FetchType.LAZY) // 멤버 테이블과 연관 관계 설정
    private Member member; // 댓글 작성자

    @Column(nullable = false, length = 500)
    private String content;
    @Column(nullable = false)

    private LocalDateTime createdAt = LocalDateTime.now();
}
