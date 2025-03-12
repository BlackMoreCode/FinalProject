import styled from "styled-components";
import { Link } from "react-router-dom";

// ✅ Link 컴포넌트를 위한 스타일링
export const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:hover {
    text-decoration: none;
  }
`;

/**
 * 전체 컨테이너 스타일
 * KR: 화면 중앙에 정렬하고, 가로 폭을 1200px로 제한합니다.
 *     상단 마진을 넉넉히(90px) 주어 헤더와 구분되도록 합니다.
 */
export const PostsContainer = styled.div`
  background-color: #f5f6f7;
  padding: 30px; /* 기존 20px → 30px으로 늘려서 여백을 확보 */
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 90px;
  font-family: "Arial", sans-serif;

  @media (max-width: 768px) {
    padding: 15px; /* 모바일에서는 살짝 줄임 */
  }
`;

/**
 * 섹션 헤더 (카테고리명 등)
 */
export const SectionHeader = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 25px; /* 기존 20px → 25px 약간 늘림 */

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

/**
 * 게시글 섹션
 * KR: 고정 게시글, 일반 게시글 구역 등을 감싸는 래퍼
 */
export const PostsSection = styled.div`
  margin-bottom: 35px; /* 기존 30px → 35px으로 조정 */

  h3 {
    font-size: 18px;
    font-weight: bold;
    color: #555;
    margin-bottom: 12px; /* 약간 늘려줌 */

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
`;

/**
 * 게시글 카드
 * KR: 박스 형태의 UI를 구성하고, hover 시 살짝 떠오르는 효과를 줍니다.
 *     padding을 늘려서 내부가 더 여유 있어 보이도록 함.
 */
export const PostCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  /* ✅ 패딩을 20px → 28px로 늘려 여백을 확보 */
  padding: 28px;
  margin-bottom: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    /* 모바일에서는 너무 넓으면 답답할 수 있으므로 살짝 조정 */
    padding: 20px;
  }
`;

/**
 * 게시글 제목
 */
export const PostTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 10px;
  &:hover {
    text-decoration: underline;
  }
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

/**
 * 게시글 상세 정보(작성자, 날짜 등)
 */
export const PostDetails = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

/**
 * 메타 정보 (작성일 등 작은 글자)
 */
export const PostMeta = styled.p`
  font-size: 12px;
  color: #777;
  margin: 5px 0;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

/**
 * 카드 오른쪽 영역 (조회수, 좋아요, 최신 댓글 등)
 */
export const PostRightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: 768px) {
    align-items: flex-start;
    margin-top: 10px;
  }
`;

/**
 * 조회수, 좋아요 수 등 작은 텍스트
 */
export const PostStat = styled.p`
  font-size: 14px;
  color: #555;
  margin: 5px 0;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

/**
 * 최신 댓글 표시 컨테이너
 * KR: 글자 크기가 작으므로 조금만 여백을 추가.
 */
export const LatestCommentContainer = styled.div`
  font-size: 12px;
  color: #666;
  text-align: right;
  margin-top: 5px;

  .comment-author {
    font-weight: bold;
    color: #333;
  }

  .comment-date {
    font-style: italic;
    color: #888;
  }

  .comment-preview {
    color: #444;
  }

  .no-comment {
    color: #aaa;
  }

  @media (max-width: 768px) {
    font-size: 10px;
    text-align: left;
  }
`;
