package com.kh.back.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "custom_style")
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CustomStyle {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "style_id")
    private Long styleId;

    @Column(name = "bg_color")
    private String bgColor;

    @Column(name = "nickname_font")
    private String nicknameFont;

    @Column(name = "nickname_size")
    private String nicknameSize;

    @Column(name = "introduce_font")
    private String introduceFont;

    @Column(name = "introduce_size")
    private String introduceSize;

    @Column(name = "text_color_nickname")
    private String textColorNickname;

    @Column(name = "text_color_introduce")
    private String textColorIntroduce;

    // Member와 1:1 관계 설정 (CustomStyle이 Member에 종속됨)
    @OneToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Builder
    public CustomStyle(Member member, String bgColor, String nicknameFont, String nicknameSize, String introduceFont, String introduceSize, String textColorNickname, String textColorIntroduce) {
        this.member = member;
        this.bgColor = bgColor;
        this.nicknameFont = nicknameFont;
        this.nicknameSize = nicknameSize;
        this.introduceFont = introduceFont;
        this.introduceSize = introduceSize;
        this.textColorNickname = textColorNickname;
        this.textColorIntroduce = textColorIntroduce;
    }
}