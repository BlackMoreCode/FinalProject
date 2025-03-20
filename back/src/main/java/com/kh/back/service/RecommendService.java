
package com.kh.back.service;


import com.kh.back.constant.Action;
import com.kh.back.dto.python.SearchListResDto;
import com.kh.back.entity.Reaction;
import com.kh.back.entity.member.Member;
import com.kh.back.repository.ReactionRepository;
import com.kh.back.service.member.CalendarService;
import com.kh.back.service.member.MemberService;
import com.kh.back.service.python.ElasticService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class RecommendService {
	private final ElasticService elasticService;
	private final CalendarService calendarService;
	private final MemberService memberService;
	private final ReactionRepository reactionRepository;
	private final RestTemplate restTemplate;
	
}
