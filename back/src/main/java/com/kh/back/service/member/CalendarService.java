package com.kh.back.service.member;

import com.kh.back.constant.Recipe;
import com.kh.back.dto.calendar.TopRatedRepoDto;
import com.kh.back.dto.calendar.request.CalendarCreateReqDto;
import com.kh.back.dto.calendar.request.CalendarReqDto;
import com.kh.back.dto.calendar.request.CalendarUpdateReqDto;
import com.kh.back.dto.calendar.res.CalendarResDto;
import com.kh.back.dto.calendar.res.TopRatedResDto;
import com.kh.back.dto.python.SearchResDto;
import com.kh.back.entity.member.Calendar;
import com.kh.back.entity.member.Member;
import com.kh.back.repository.member.CalendarRepository;
import com.kh.back.service.python.ElasticService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j @Service
@RequiredArgsConstructor
public class CalendarService {
	private final CalendarRepository calendarRepository;
	private final MemberService memberService;
	private final ElasticService elasticService;
	
	
	// ✅ DTO 값에 따라 적절한 조회 메서드 호출
	public List<CalendarResDto> getCalendarByFilter(CalendarReqDto reqDto) {
		try {
			// 필수값 검증
			Long memberId = reqDto.getMemberId();
			if (memberId == null) {
				log.warn("Member ID가 없습니다.");
				return null;
			}
			
			// 멤버 정보 가져오기
			Member member = memberService.getMemberById(memberId);
			if (member == null) {
				log.warn("존재하지 않는 멤버입니다: {}", memberId);
				return null;
			}
			
			// DTO 값에 따라 적절한 Repository 메서드 선택
			List<Calendar> calendars;
			
			if (reqDto.getStart() != null && reqDto.getEnd() != null  && reqDto.getRecipe() != null) {
				// ✅ 특정 멤버 + 특정 레시피 + 날짜 범위
				calendars = calendarRepository.findByMemberAndRecipeAndDateBetween(
					member,
					Recipe.valueOf(reqDto.getRecipe()),
					reqDto.getStart(),
					reqDto.getEnd()
				);
				
			} else if (reqDto.getStart() != null && reqDto.getEnd() != null) {
				// ✅ 특정 멤버 + 날짜 범위
				calendars = calendarRepository.findByMemberAndDateBetween(
					member,
					reqDto.getStart(),
					reqDto.getEnd()
				);
				
			} else if (reqDto.getRecipe() != null) {
				// ✅ 특정 멤버 + 특정 레시피
				calendars = calendarRepository.findByMemberAndRecipe(
					member,
					Recipe.valueOf(reqDto.getRecipe())
				);
				
			} else {
				// ✅ 특정 멤버 전체 조회
				calendars = calendarRepository.findByMember(member);
			}
			
			return calendars.stream()
				.map(this::convertCalendarToDto)
				.collect(Collectors.toList());
			
		} catch (Exception e) {
			log.error("캘린더 조회 오류: {}", e.getMessage(), e);
			return null;
		}
	}
	
	public boolean createCalendar(CalendarCreateReqDto reqDto, Authentication auth) {
		try{
			SearchResDto searchResDto = elasticService.detail(reqDto.getRecipeId(), reqDto.getCategory());
			if (searchResDto == null) {
				log.error("생성하려는 레시피가 존재하지 않음 : {} - {}", reqDto.getRecipeId(), reqDto.getCategory());
				return false;
			}
			Member member = memberService.convertAuthToEntity(auth);
			if (calendarRepository.existsByMemberAndDateAndRecipeId(member, reqDto.getDate(), reqDto.getRecipeId())) {
				log.error("생성하려는 캘린더가 이미 있습니다.");
				return false;
			}
			Calendar calendar = new Calendar();
			calendar.setMember(member);
			calendar.setRecipeId(reqDto.getRecipeId());
			calendar.setMemo(reqDto.getMemo());
			calendar.setAmount(reqDto.getAmount());
			calendar.setRecipe(Recipe.valueOf(reqDto.getCategory()));
			calendar.setRecipeName(searchResDto.getName());
			calendar.setDate(reqDto.getDate() != null ? reqDto.getDate() : LocalDate.now());
			log.warn("저장한 캘린더 : {}", calendar);
			calendarRepository.save(calendar);
			return true;
		} catch (Exception e) {
			log.error("캘린더 생성중 에러 : {}", e.getMessage());
			return false;
		}
	}
	
	public boolean updateCalendar(CalendarUpdateReqDto reqDto, Authentication auth) {
		try{
			Member member = memberService.convertAuthToEntity(auth);
			Calendar calendar = calendarRepository.findById(reqDto.getId())
				.orElseThrow(() -> new RuntimeException("해당 캘린더가 존재하지 않습니다."));
			if(!calendar.getMember().equals(member)){
				log.error("사용자는 캘린더의 작성자가 아닙니다. {}-{}", calendar, member);
				return false;
			}
			SearchResDto searchResDto = elasticService.detail(reqDto.getRecipeId(), reqDto.getCategory());
			if (searchResDto == null) {
				log.error("수정하려는 레시피가 존재하지 않음 : {} - {}", reqDto.getRecipeId(), reqDto.getCategory());
				return false;
			}
			if (calendarRepository.existsByMemberAndDateAndRecipeId(member, reqDto.getDate(), reqDto.getRecipeId())) {
				log.error("수정하려는 캘린더가 이미 있습니다.");
				return false;
			}
			calendar.setAmount(reqDto.getAmount());
			calendar.setDate(reqDto.getDate());
			calendar.setRecipeId(reqDto.getRecipeId());
			calendar.setRecipeName(searchResDto.getName());
			calendar.setMemo(reqDto.getMemo());
			calendar.setRecipe(Recipe.valueOf(reqDto.getCategory()));
			log.warn("수정된 캘린더 : {}", calendar);
			calendarRepository.save(calendar);
			return true;
		} catch (Exception e) {
			log.error("캘린더 수정중 에러 : {}", e.getMessage());
			return false;
		}
	}
	
	public boolean deleteCalendar(Long id, Authentication auth) {
		try {
			Member member = memberService.convertAuthToEntity(auth);
			Calendar calendar = calendarRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("해당 캘린더가 존재하지 않습니다."));
			if (!calendar.getMember().equals(member)) {
				log.error("해당 회원은 캘린더의 주인이 아닙니다. {}-{}", calendar, member);
				return false;
			}
			calendarRepository.delete(calendar);
			return true;
			
		} catch (Exception e) {
			log.error("{}의 이유로 캘린더 삭제에 실패했습니다.",e.getMessage());
			return false;
		}
	}
	
	public List<TopRatedResDto> getTop3RecipeByIndex(String recipe){
		try {
			PageRequest pageRequest = PageRequest.of(0, 3);
			List<Calendar> calendarList = calendarRepository.findAll();
			List<TopRatedRepoDto> rst = calendarRepository.findTopRecipeRanking(Recipe.valueOf(recipe), pageRequest).getContent();
			log.warn("결과 : {} - 전체 : {}", rst, calendarList);
			List<TopRatedResDto> topList = new ArrayList<>();
			for (int i = 0; i < rst.size(); i++) {
				TopRatedResDto topRatedResDto = new TopRatedResDto();
				topRatedResDto.setRecipeId(rst.get(i).getRecipeId());
				topRatedResDto.setRate(i+1);
				topRatedResDto.setCount(rst.get(i).getCount());
				topList.add(topRatedResDto);
			}
			log.warn("캘린더 추가된 상위 3개 리스트 {}", topList);
			return topList;

		} catch (Exception e) {
			log.error("상위 3개 리스트 반환중 오류 {}",e.getMessage());
			return null;
		}
	}
	
	public boolean existsCalendar(String recipeId, LocalDate date, Authentication auth) {
		try{
			Member member = memberService.convertAuthToEntity(auth);
			return calendarRepository.existsByMemberAndDateAndRecipeId(member, date, recipeId);
		} catch (Exception e) {
			log.error("켈린더 여부 확인중 에러 : {} - {}", e.getMessage(), auth);
			return false;
		}
	}
	
	public CalendarResDto getCalendar(Long calendarId, Authentication auth) {
		try{
			Calendar calendar = calendarRepository.findById(calendarId)
				.orElseThrow(() -> new RuntimeException("해당 캘린더가 없습니다."));
			Member member = memberService.convertAuthToEntity(auth);
			if(!calendar.getMember().equals(member)){
				log.error("Calendar의 주인이 아닌 사람이 캘린더를 조회하고 있습니다.");
				return null;
			}
			return convertCalendarToDto(calendar);
		} catch (Exception e) {
			log.error("캘린더 단일 조회중 에러");
			return null;
		}
	}
	
	// ✅ Calendar → CalendarResDto 변환
	private CalendarResDto convertCalendarToDto(Calendar calendar) {
		return CalendarResDto.builder()
			.calendarId(calendar.getId())
			.amount(calendar.getAmount())
			.memo(calendar.getMemo())
			.date(calendar.getDate())
			.recipeId(calendar.getRecipeId())
			.memberId(calendar.getMember().getMemberId())
			.recipe(calendar.getRecipe())
			.recipeName(calendar.getRecipeName())
			.build();
	}
}
