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
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "member_id")
	private Member member;
	
	private LocalDate date;
	
	@Enumerated(EnumType.STRING)
	private Recipe recipe;
	
	private String recipeId;
	
	private String recipeName;
	
	private String amount;
	
	private String memo;
}
