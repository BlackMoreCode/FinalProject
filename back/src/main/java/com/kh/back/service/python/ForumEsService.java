package com.kh.back.service.python;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.back.dto.forum.request.ForumPostCommentRequestDto;
import com.kh.back.dto.forum.request.ForumPostRequestDto;
import com.kh.back.dto.forum.response.ForumCategoryDto;
import com.kh.back.dto.forum.response.ForumPostCommentResponseDto;
import com.kh.back.dto.forum.response.ForumPostLikeResponseDto;
import com.kh.back.dto.forum.response.ForumPostResponseDto;
import com.kh.back.dto.python.SearchListResDto;
import com.kh.back.dto.python.SearchResDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * ForumEsService
 *
 * 포럼(게시글, 댓글, 카테고리, 좋아요 등) 관련 기능을 Flask 백엔드(/forum/*)에 위임하는 서비스 클래스입니다.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ForumEsService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String flaskBaseUrl = "http://localhost:5001";

    // === 게시글 관련 메서드 ===

    public ForumPostResponseDto createPost(ForumPostRequestDto requestDto) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/post");
            String jsonBody = objectMapper.writeValueAsString(requestDto);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody);
            ResponseEntity<String> response = restTemplate.postForEntity(uri, entity, String.class);
            log.info("createPost 응답: {}", response);
            return objectMapper.readValue(response.getBody(), ForumPostResponseDto.class);
        } catch (Exception e) {
            log.error("게시글 생성 중 오류: {}", e.getMessage());
            return null;
        }
    }

    public ForumPostResponseDto updatePostTitle(Integer postId, String newTitle, String editedBy) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/post/" + postId + "/title");
            String jsonBody = String.format("{\"title\": \"%s\", \"editedBy\": \"%s\"}", newTitle, editedBy);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody);
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.PUT, entity, String.class);
            log.info("updatePostTitle 응답: {}", response);
            return objectMapper.readValue(response.getBody(), ForumPostResponseDto.class);
        } catch (Exception e) {
            log.error("게시글 제목 수정 중 오류: {}", e.getMessage());
            return null;
        }
    }

    public ForumPostResponseDto updatePostContent(Integer postId, String contentJSON, String editedBy, boolean isAdmin) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/post/" + postId + "/content");
            String jsonBody = String.format("{\"contentJSON\": \"%s\", \"editedBy\": \"%s\", \"isAdmin\": %s}",
                    contentJSON, editedBy, isAdmin);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody);
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.PUT, entity, String.class);
            log.info("updatePostContent 응답: {}", response);
            return objectMapper.readValue(response.getBody(), ForumPostResponseDto.class);
        } catch (Exception e) {
            log.error("게시글 내용 수정 중 오류: {}", e.getMessage());
            return null;
        }
    }

    public boolean deletePost(Integer postId, String removedBy) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/post/" + postId + "?removedBy=" +
                    URLEncoder.encode(removedBy, StandardCharsets.UTF_8));
            restTemplate.delete(uri);
            log.info("deletePost 호출됨, 게시글 ID: {}", postId);
            return true;
        } catch (Exception e) {
            log.error("게시글 삭제 중 오류: {}", e.getMessage());
            return false;
        }
    }

    public boolean hardDeletePost(Integer postId) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/post/" + postId + "/hard-delete");
            restTemplate.delete(uri);
            log.info("hardDeletePost 호출됨, 게시글 ID: {}", postId);
            return true;
        } catch (Exception e) {
            log.error("게시글 하드 삭제 중 오류: {}", e.getMessage());
            return false;
        }
    }

    public ForumPostResponseDto reportPost(Integer postId, Integer reporterId, String reason) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/post/" + postId + "/report");
            String jsonBody = String.format("{\"reporterId\": %d, \"reason\": \"%s\"}", reporterId, reason);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody);
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.POST, entity, String.class);
            log.info("reportPost 응답: {}", response);
            return objectMapper.readValue(response.getBody(), ForumPostResponseDto.class);
        } catch (Exception e) {
            log.error("게시글 신고 처리 중 오류: {}", e.getMessage());
            return null;
        }
    }

    public boolean hidePost(Integer postId) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/post/" + postId + "/hide");
            restTemplate.postForEntity(uri, null, String.class);
            log.info("hidePost 호출됨, 게시글 ID: {}", postId);
            return true;
        } catch (Exception e) {
            log.error("게시글 숨김 처리 중 오류: {}", e.getMessage());
            return false;
        }
    }

    public boolean restorePost(Integer postId) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/post/" + postId + "/restore");
            restTemplate.postForEntity(uri, null, String.class);
            log.info("restorePost 호출됨, 게시글 ID: {}", postId);
            return true;
        } catch (Exception e) {
            log.error("게시글 복구 중 오류: {}", e.getMessage());
            return false;
        }
    }

    public boolean incrementViewCount(Integer postId) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/post/" + postId + "/increment-view");
            restTemplate.postForEntity(uri, null, String.class);
            log.info("incrementViewCount 호출됨, 게시글 ID: {}", postId);
            return true;
        } catch (Exception e) {
            log.error("게시글 조회수 증가 중 오류: {}", e.getMessage());
            return false;
        }
    }

    // === 검색 및 상세조회 관련 메서드 ===

    /**
     * 포럼 게시글 검색 메서드
     * - Flask의 /search?q=...&type=forum&category=...&page=...&size=... 엔드포인트를 호출하여 검색합니다.
     *
     * @param q        검색어
     * @param category 카테고리(문자열)
     * @param page     페이지 번호
     * @param size     페이지 크기
     * @return ForumPostResponseDto 리스트
     */
    public List<ForumPostResponseDto> search(String q, String category, int page, int size) {
        try {
            String encodedQ = URLEncoder.encode(q, StandardCharsets.UTF_8);
            String encodedType = "forum"; // 고정
            String categoryParam = (category != null && !category.isEmpty())
                    ? "&category=" + URLEncoder.encode(category, StandardCharsets.UTF_8)
                    : "";

            URI uri = new URI(flaskBaseUrl + "/search?q=" + encodedQ
                    + "&type=" + encodedType
                    + categoryParam
                    + "&page=" + page
                    + "&size=" + size);
            log.info("[ForumEsService.search] 호출 URI: {}", uri);

            ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
            log.info("[ForumEsService.search] 응답: {}", response);

            ForumPostResponseDto[] array = objectMapper.readValue(response.getBody(), ForumPostResponseDto[].class);
            List<ForumPostResponseDto> resultList = new ArrayList<>();
            for (ForumPostResponseDto item : array) {
                resultList.add(item);
            }
            return resultList;

        } catch (Exception e) {
            log.error("포럼 검색 중 오류: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 포럼 게시글 상세조회 메서드
     * - Flask의 /detail/{postId}?type=forum 엔드포인트를 호출하여 상세 정보를 조회합니다.
     *
     * @param postId 상세조회할 게시글 ID
     * @return ForumPostResponseDto 객체 (없으면 null)
     */
    public ForumPostResponseDto detail(Integer postId) {
        try {
            URI uri = new URI(flaskBaseUrl + "/detail/" + postId + "?type=forum");
            log.info("[ForumEsService.detail] 호출 URI: {}", uri);

            ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
            log.info("[ForumEsService.detail] 응답: {}", response);

            return objectMapper.readValue(response.getBody(), ForumPostResponseDto.class);

        } catch (Exception e) {
            log.error("포럼 상세조회 중 오류: {}", e.getMessage());
            return null;
        }
    }

    // === 댓글 관련 메서드 ===

    public ForumPostCommentResponseDto createComment(ForumPostCommentRequestDto requestDto) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/comment");
            String jsonBody = objectMapper.writeValueAsString(requestDto);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody);
            ResponseEntity<String> response = restTemplate.postForEntity(uri, entity, String.class);
            log.info("createComment 응답: {}", response);
            return objectMapper.readValue(response.getBody(), ForumPostCommentResponseDto.class);
        } catch (Exception e) {
            log.error("댓글 생성 중 오류: {}", e.getMessage());
            return null;
        }
    }

    public ForumPostCommentResponseDto updateComment(Integer commentId, ForumPostCommentRequestDto requestDto, String editedBy, boolean isAdmin) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/comment/" + commentId + "/content");
            String jsonBody = String.format("{\"contentJSON\": \"%s\", \"editedBy\": \"%s\", \"isAdmin\": %s}",
                    requestDto.getContentJSON(), editedBy, isAdmin);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody);
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.PUT, entity, String.class);
            log.info("updateComment 응답: {}", response);
            return objectMapper.readValue(response.getBody(), ForumPostCommentResponseDto.class);
        } catch (Exception e) {
            log.error("댓글 수정 중 오류: {}", e.getMessage());
            return null;
        }
    }

    public List<ForumPostCommentResponseDto> searchCommentsForPost(Integer postId) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/post/" + postId + "/comments");
            ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
            log.info("searchCommentsForPost 응답: {}", response);
            return objectMapper.readValue(response.getBody(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, ForumPostCommentResponseDto.class));
        } catch (Exception e) {
            log.error("댓글 목록 조회 중 오류: {}", e.getMessage());
            return null;
        }
    }

    public boolean deleteComment(Integer commentId, Long deletedBy) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/comment/" + commentId + "?deletedBy=" + deletedBy);
            restTemplate.delete(uri);
            log.info("deleteComment 호출됨, 댓글 ID: {}", commentId);
            return true;
        } catch (Exception e) {
            log.error("댓글 삭제 중 오류: {}", e.getMessage());
            return false;
        }
    }

    public boolean hardDeleteComment(Integer commentId) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/comment/" + commentId + "/hard-delete");
            restTemplate.delete(uri);
            log.info("hardDeleteComment 호출됨, 댓글 ID: {}", commentId);
            return true;
        } catch (Exception e) {
            log.error("댓글 하드 삭제 중 오류: {}", e.getMessage());
            return false;
        }
    }

    public ForumPostCommentResponseDto reportComment(Integer commentId, Integer reporterId, String reason) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/comment/" + commentId + "/report");
            String jsonBody = String.format("{\"reporterId\": %d, \"reason\": \"%s\"}", reporterId, reason);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody);
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.POST, entity, String.class);
            log.info("reportComment 응답: {}", response);
            return objectMapper.readValue(response.getBody(), ForumPostCommentResponseDto.class);
        } catch (Exception e) {
            log.error("댓글 신고 처리 중 오류: {}", e.getMessage());
            return null;
        }
    }

    public boolean hideComment(Integer commentId) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/comment/" + commentId + "/hide");
            restTemplate.postForEntity(uri, null, String.class);
            log.info("hideComment 호출됨, 댓글 ID: {}", commentId);
            return true;
        } catch (Exception e) {
            log.error("댓글 숨김 처리 중 오류: {}", e.getMessage());
            return false;
        }
    }

    public ForumPostCommentResponseDto restoreComment(Integer commentId) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/comment/" + commentId + "/restore");
            ResponseEntity<String> response = restTemplate.postForEntity(uri, null, String.class);
            log.info("restoreComment 응답: {}", response);
            return objectMapper.readValue(response.getBody(), ForumPostCommentResponseDto.class);
        } catch (Exception e) {
            log.error("댓글 복원 중 오류: {}", e.getMessage());
            return null;
        }
    }

    public boolean incrementCommentLikes(Integer commentId) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/comment/" + commentId + "/increment-like");
            restTemplate.postForEntity(uri, null, String.class);
            log.info("incrementCommentLikes 호출됨, 댓글 ID: {}", commentId);
            return true;
        } catch (Exception e) {
            log.error("댓글 좋아요 증가 중 오류: {}", e.getMessage());
            return false;
        }
    }

    // === 카테고리 관련 메서드 ===

    public ForumCategoryDto createCategory(ForumCategoryDto categoryDto) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/category");
            String jsonBody = objectMapper.writeValueAsString(categoryDto);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
            log.info("카테고리 생성 요청: '{}' URI: {} / body: {}", categoryDto.getTitle(), uri, jsonBody);
            ResponseEntity<String> response = restTemplate.postForEntity(uri, entity, String.class);
            log.info("카테고리 생성 응답: {}", response.getBody());
            return objectMapper.readValue(response.getBody(), ForumCategoryDto.class);
        } catch (Exception e) {
            log.error("카테고리 생성 중 오류 ('{}'): {}", categoryDto.getTitle(), e.getMessage());
            return null;
        }
    }

    public ForumCategoryDto getCategoryByTitle(String title) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/category/search?title=" +
                    URLEncoder.encode(title, StandardCharsets.UTF_8));
            log.info("카테고리 제목 조회 요청: '{}' URI: {}", title, uri);
            ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
            log.info("카테고리 조회 응답: {}", response.getBody());
            return objectMapper.readValue(response.getBody(), ForumCategoryDto.class);
        } catch (Exception e) {
            log.error("카테고리 제목 조회 중 오류 ('{}'): {}", title, e.getMessage());
            return null;
        }
    }

    public List<ForumCategoryDto> getAllCategoriesFromElastic() {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/category");
            log.info("전체 카테고리 조회 요청, URI: {}", uri);
            ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
            log.info("전체 카테고리 조회 응답: {}", response.getBody());
            return objectMapper.readValue(response.getBody(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, ForumCategoryDto.class));
        } catch (Exception e) {
            log.error("전체 카테고리 조회 중 오류: {}", e.getMessage());
            return null;
        }
    }

    public ForumCategoryDto getCategoryById(Integer categoryId) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/category/" + categoryId);
            log.info("카테고리 ID 조회 요청: '{}' URI: {}", categoryId, uri);
            ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
            log.info("카테고리 ID 조회 응답: {}", response.getBody());
            return objectMapper.readValue(response.getBody(), ForumCategoryDto.class);
        } catch (Exception e) {
            log.error("카테고리 ID 조회 중 오류 (ID: {}): {}", categoryId, e.getMessage());
            return null;
        }
    }

    // === 좋아요(Like) 토글 메서드 ===

    public ForumPostLikeResponseDto togglePostLike(Integer postId, Long memberId) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/post/" + postId + "/like?memberId=" + memberId);
            ResponseEntity<String> response = restTemplate.postForEntity(uri, null, String.class);
            log.info("togglePostLike 응답: {}", response);
            return objectMapper.readValue(response.getBody(), ForumPostLikeResponseDto.class);
        } catch (Exception e) {
            log.error("게시글 좋아요 토글 중 오류: {}", e.getMessage());
            return null;
        }
    }

    public ForumPostLikeResponseDto toggleCommentLike(Integer commentId, Long memberId) {
        try {
            URI uri = new URI(flaskBaseUrl + "/forum/comment/" + commentId + "/like?memberId=" + memberId);
            ResponseEntity<String> response = restTemplate.postForEntity(uri, null, String.class);
            log.info("toggleCommentLike 응답: {}", response);
            return objectMapper.readValue(response.getBody(), ForumPostLikeResponseDto.class);
        } catch (Exception e) {
            log.error("댓글 좋아요 토글 중 오류: {}", e.getMessage());
            return null;
        }
    }
}
