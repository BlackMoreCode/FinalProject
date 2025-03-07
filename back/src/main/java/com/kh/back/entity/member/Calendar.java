package com.kh.back.entity.member;

import com.kh.back.constant.Recipe;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;

@Entity @Getter @Setter
@ToString @NoArgsConstructor
@AllArgsConstructor @Table(name = "calendar")
public class Calendar {
	@Id
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "member_id")
	private Member member;
	
	private LocalDate date;
	
	@Enumerated
	private Recipe recipe;
	
	private String recipeId;
	
	private String amount;
	
	private String memo;
}
