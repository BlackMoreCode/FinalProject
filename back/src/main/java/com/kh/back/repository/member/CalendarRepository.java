package com.kh.back.repository.member;

import com.kh.back.constant.Recipe;
import com.kh.back.dto.calendar.TopRatedRepoDto;
import com.kh.back.entity.member.Calendar;
import com.kh.back.entity.member.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CalendarRepository extends JpaRepository<Calendar, Long> {
	List<Calendar> findByMember(Member member);
	List<Calendar> findByMemberAndDateBetween(Member member, LocalDate start, LocalDate end);
	
	List<Calendar> findByMemberAndRecipe(Member member, Recipe recipe);
	List<Calendar> findByMemberAndRecipeAndDateBetween(Member member, Recipe recipe, LocalDate start, LocalDate end);
	
	boolean existsByMemberAndDateAndRecipeId(Member member, LocalDate date, String recipeId);
	
	
	@Query("SELECT new com.kh.back.dto.calendar.TopRatedRepoDto(c.recipeId, COUNT(DISTINCT c.date)) FROM Calendar c " +
		"WHERE c.recipe = ?1 GROUP BY c.recipeId ORDER BY COUNT(DISTINCT c.date) DESC")
	Page<TopRatedRepoDto> findTopRecipeRanking(Recipe recipe, Pageable pageable);
	
	
	
	
}
