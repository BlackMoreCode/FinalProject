package com.kh.back.dto.comment;


import com.kh.back.entity.Comment;
import com.kh.back.entity.Member;
import lombok.*;

import java.time.LocalDateTime;
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class CommentResDto {

    private String nickName;
    private String content;

    public static CommentResDto fromEntity(Comment comment) {
        return new CommentResDto(
                comment.getMember().getNickName(),
                comment.getContent()
        );
    }
}
