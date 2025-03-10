package com.kh.back.service.forum;

import com.kh.back.dto.forum.request.ForumPostRequestDto;
import com.kh.back.dto.forum.response.ForumPostCommentResponseDto;
import com.kh.back.dto.forum.response.ForumPostResponseDto;
import com.kh.back.dto.forum.response.PaginationDto;
import com.kh.back.dto.python.SearchListResDto;
import com.kh.back.dto.python.SearchResDto;
import com.kh.back.service.member.MemberService;
import com.kh.back.service.python.ForumEsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ForumPostService {

    private final ForumEsService forumEsService;
    private final MemberService memberService;

    private static final int REPORT_THRESHOLD = 10;

    /**
     * HTML 내용 Sanitizing 메서드
     */
    private String sanitizeHtml(String content) {
        if (content == null || content.isEmpty()) return content;
        Safelist safelist = Safelist.relaxed()
                .addAttributes("blockquote", "class")
                .addAttributes("a", "href", "rel", "target")
                .addProtocols("a", "href", "#", "http", "https", "mailto", "tel", "ftp");
        return Jsoup.clean(content, safelist);
    }

    /**
     * 게시글 생성
     */
    @Transactional
    public ForumPostResponseDto createPost(ForumPostRequestDto requestDto) {
        log.info("게시글 생성 요청, 제목: {}", requestDto.getTitle());

        if (requestDto.getMemberId() == null) {
            throw new IllegalArgumentException("회원 ID는 null일 수 없습니다.");
        }
        if (requestDto.getCategoryId() == null) {
            throw new IllegalArgumentException("카테고리 ID는 null일 수 없습니다.");
        }

        // 게시글 생성 전에 HTML 내용을 Sanitizing 처리
        String sanitizedContent = sanitizeHtml(requestDto.getContent());
        requestDto.setContent(sanitizedContent);

        ForumPostResponseDto createdDto = forumEsService.createPost(requestDto);
        log.info("ES에 게시글 생성됨. ID: {}", createdDto.getId());
        return createdDto;
    }

    /**
     * 카테고리별 게시글 조회 및 페이지네이션
     */
    public PaginationDto<ForumPostResponseDto> getPostsByCategory(String categoryId, int page, int size) {
        log.info("카테고리 ID: {} 의 게시글 조회, 페이지: {}, 사이즈: {}", categoryId, page, size);
        String categoryStr = (categoryId != null) ? categoryId.toString() : "";
        List<ForumPostResponseDto> rawResults = forumEsService.search("", categoryStr, page, size);
        if (rawResults == null) {
            return new PaginationDto<>(List.of(), page, 0, 0L);
        }
        List<ForumPostResponseDto> postList = new ArrayList<>(rawResults);
        // totalPages와 totalElements는 필요에 따라 계산 (현재는 더미 값 사용)
        int totalPages = 1;
        long totalElements = postList.size();
        return new PaginationDto<>(postList, page, totalPages, totalElements);
    }

    /**
     * 게시글 상세 조회
     */
    public Optional<ForumPostResponseDto> getPostDetails(String postId) {
        log.info("게시글 상세 조회, ID: {}", postId);
        ForumPostResponseDto rawDto = forumEsService.detail(postId);
        if (rawDto == null) {
            return Optional.empty();
        }
        return Optional.of(rawDto);
    }

    /**
     * 게시글 제목 수정
     */
    @Transactional
    public ForumPostResponseDto updatePostTitle(String postId, String title, Long loggedInMemberId, boolean isAdmin) {
        log.info("게시글 제목 수정 요청, ID: {}", postId);
        ForumPostResponseDto existing = getPostDetails(postId).orElseThrow(
                () -> new IllegalArgumentException("해당 ID의 게시글이 존재하지 않습니다: " + postId)
        );
        if (!isAdmin && !existing.getMemberId().equals(loggedInMemberId)) {
            throw new SecurityException("이 게시글의 제목을 수정할 권한이 없습니다.");
        }
        ForumPostResponseDto updated = forumEsService.updatePostTitle(
                postId,
                title,
                isAdmin ? "ADMIN" : existing.getAuthorName()
        );
        return updated;
    }

    /**
     * 게시글 내용 수정 (TipTap JSON)
     */
    @Transactional
    public ForumPostResponseDto updatePostContent(String postId, String contentJSON, Long loggedInMemberId, boolean isAdmin) {
        log.info("게시글 내용 수정 요청, ID: {} / 요청자 ID: {}", postId, loggedInMemberId);
        ForumPostResponseDto existing = getPostDetails(postId).orElseThrow(
                () -> new IllegalArgumentException("해당 ID의 게시글이 존재하지 않습니다: " + postId)
        );
        if (!isAdmin && !existing.getMemberId().equals(loggedInMemberId)) {
            throw new SecurityException("이 게시글의 내용을 수정할 권한이 없습니다.");
        }
        if (contentJSON == null || contentJSON.trim().isEmpty()) {
            throw new IllegalArgumentException("콘텐츠 JSON은 비어있을 수 없습니다.");
        }
        ForumPostResponseDto updated = forumEsService.updatePostContent(
                postId,
                contentJSON,
                isAdmin ? "ADMIN" : existing.getAuthorName(),
                isAdmin
        );
        return updated;
    }

    /**
     * 게시글 삭제 (소프트 삭제)
     */
    @Transactional
    public void deletePost(String postId, Long loggedInMemberId, String removedBy) {
        log.info("게시글 삭제 요청, ID: {} / 사용자 ID: {}", postId, loggedInMemberId);
        ForumPostResponseDto existing = getPostDetails(postId).orElseThrow(
                () -> new IllegalArgumentException("유효하지 않은 게시글 ID: " + postId)
        );
        boolean isAdmin = memberService.isAdmin(loggedInMemberId);
        if (!existing.getMemberId().equals(loggedInMemberId) && !isAdmin) {
            throw new AccessDeniedException("이 게시글을 삭제할 권한이 없습니다.");
        }
        forumEsService.deletePost(postId, removedBy);
        log.info("게시글 ID: {} 가 ES에서 삭제 처리됨.", postId);
    }

    /**
     * 게시글 하드 삭제 (관리자 전용)
     */
    @Transactional
    public void hardDeletePost(String postId) {
        log.info("게시글 하드 삭제 요청, ID: {}", postId);
        forumEsService.hardDeletePost(postId);
        log.info("게시글 ID: {} 가 ES에서 하드 삭제됨.", postId);
    }

    /**
     * 게시글 신고 처리
     */
    @Transactional
    public ForumPostResponseDto reportPost(String postId, Long reporterId, String reason) {
        log.info("게시글 신고 요청, ID: {} / 신고자 ID: {}", postId, reporterId);
        ForumPostResponseDto existing = getPostDetails(postId).orElseThrow(
                () -> new IllegalArgumentException("유효하지 않은 게시글 ID: " + postId)
        );
        if (existing.getMemberId().equals(reporterId)) {
            throw new IllegalArgumentException("자신의 게시글은 신고할 수 없습니다.");
        }
        ForumPostResponseDto updated = forumEsService.reportPost(postId, reporterId.intValue(), reason);
        return updated;
    }

    /**
     * 게시글 숨김 처리
     */
    @Transactional
    public void hidePost(String postId) {
        log.info("게시글 숨김 요청, ID: {}", postId);
        forumEsService.hidePost(postId);
    }

    /**
     * 숨김 또는 삭제된 게시글 복구
     */
    @Transactional
    public void restorePost(String postId) {
        log.info("게시글 복구 요청, ID: {}", postId);
        forumEsService.restorePost(postId);
    }

    /**
     * 게시글 조회수 증가
     */
    @Transactional
    public void incrementViewCount(String postId) {
        log.info("게시글 조회수 증가 요청, ID: {}", postId);
        forumEsService.incrementViewCount(postId);
    }

    /**
     * 게시글 인용
     */
    @Transactional
    public ForumPostResponseDto quotePost(Integer quotingMemberId, String quotedPostId, String commentContent) {
        log.info("게시글 인용 요청, 인용 대상 게시글 ID: {} / 인용 회원 ID: {}", quotedPostId, quotingMemberId);
        ForumPostResponseDto quoted = getPostDetails(quotedPostId).orElseThrow(
                () -> new IllegalArgumentException("인용 대상 게시글을 찾을 수 없습니다.")
        );
        if (quoted.getHidden() || quoted.getRemovedBy() != null) {
            throw new IllegalStateException("숨김 처리되거나 삭제된 게시글은 인용할 수 없습니다.");
        }
        String quotedText = String.format(
                "<blockquote><strong>%s</strong> wrote:<br><em>%s</em></blockquote><p>%s</p>",
                quoted.getAuthorName(),
                quoted.getContent(),
                commentContent
        );
        ForumPostRequestDto newPost = ForumPostRequestDto.builder()
                .memberId(Long.valueOf(quotingMemberId))
                .categoryId(null) // 필요 시 인용 대상 게시글의 카테고리를 사용할 수 있음
                .title("Reply to: " + quoted.getTitle())
                .content(quotedText)
                .contentJSON(null)
                .sticky(false)
                .build();
        ForumPostResponseDto saved = createPost(newPost);
        return saved;
    }

    /**
     * 게시글 수정 권한 확인
     */
    public boolean canEditPost(String postId, Long loggedInMemberId) {
        log.info("게시글 수정 권한 확인 요청, ID: {} / 사용자 ID: {}", postId, loggedInMemberId);
        ForumPostResponseDto existing = getPostDetails(postId).orElseThrow(
                () -> new IllegalArgumentException("유효하지 않은 게시글 ID: " + postId)
        );
        return existing.getMemberId().equals(loggedInMemberId);
    }

    /**
     * 게시글 삭제 권한 확인
     */
    public boolean canDeletePost(String postId, Long loggedInMemberId) {
        log.info("게시글 삭제 권한 확인 요청, ID: {} / 사용자 ID: {}", postId, loggedInMemberId);
        ForumPostResponseDto existing = getPostDetails(postId).orElseThrow(
                () -> new IllegalArgumentException("유효하지 않은 게시글 ID: " + postId)
        );
        return existing.getMemberId().equals(loggedInMemberId);
    }

    /**
     * 파일 저장 (선택 사항)
     */
    private String saveFile(MultipartFile file) {
        log.info("파일 저장 요청, 파일명: {}", file.getOriginalFilename());
        return "http://localhost/files/" + file.getOriginalFilename();
    }
}
