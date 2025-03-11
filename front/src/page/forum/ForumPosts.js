import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ForumApi from "../../api/ForumApi";
import {
  PostsContainer,
  SectionHeader,
  PostsSection,
  PostCard,
  PostTitle,
  PostDetails,
  PostMeta,
  PostRightSection,
  PostStat,
  LatestCommentContainer, // 최신 댓글을 표시하기 위한 스타일
  StyledLink,
} from "./style/ForumPostsStyles";

/**
 * ForumPosts 컴포넌트
 * KR: 해당 컴포넌트는 선택한 카테고리의 게시글 목록을 가져오고,
 *     카테고리 이름을 표시합니다.
 *     (카테고리의 최신 게시글 정보는 제외됨)
 */
const ForumPosts = () => {
  const { categoryId } = useParams(); // URL에서 카테고리 ID 가져오기
  const [posts, setPosts] = useState([]); // 일반 게시글 상태
  const [stickyPosts, setStickyPosts] = useState([]); // 고정 게시글 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [categoryName, setCategoryName] = useState(""); // 카테고리 이름 상태

  /**
   * HTML 태그 제거 함수
   * KR: 댓글 미리보기 내용에서 HTML 태그를 제거하여 순수 텍스트만 추출합니다.
   *
   * @param {string} html - HTML 문자열
   * @returns {string} - HTML 태그가 제거된 텍스트
   */
  const stripHtmlTags = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  /**
   * fetchPosts 함수
   * KR: ForumApi를 사용하여 지정된 카테고리의 게시글과 카테고리 정보를 가져옵니다.
   *     게시글 데이터는 페이지네이션하여 가져오며, 카테고리 정보는 단순 조회(getCategoryById)를 사용합니다.
   */
  const fetchPosts = async () => {
    try {
      // 게시글 데이터를 첫 페이지 (page 1) 기준으로 가져옵니다.
      const data = await ForumApi.getPostsByCategoryId(categoryId, 1, 10);
      console.log("검색된 게시글 데이터:", data);

      // PaginationDto 형식이면 content 배열, 아니면 data 자체 배열을 사용
      const postList = data.content || data.data || [];
      console.log("게시글 목록:", postList);

      // 게시글 목록이 비어 있는 경우 경고 로그 출력
      if (postList.length === 0) {
        console.warn("검색 결과가 없습니다. (게시글 목록이 비어 있음)");
      }

      // 고정 게시글과 일반 게시글 분리
      setStickyPosts(postList.filter((post) => post.sticky));
      setPosts(postList.filter((post) => !post.sticky));

      // 단순 카테고리 정보 조회: getCategoryById 호출
      const category = await ForumApi.getCategoryById(categoryId);
      console.log("가져온 카테고리 정보:", category);
      setCategoryName(category.name);
    } catch (error) {
      console.error("게시글 데이터를 가져오는데 실패했습니다.", error);
    } finally {
      setLoading(false);
    }
  };

  // categoryId가 변경되거나 컴포넌트가 마운트 될 때 fetchPosts 호출
  useEffect(() => {
    fetchPosts();
  }, [categoryId]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <PostsContainer>
      <SectionHeader>{categoryName}</SectionHeader>

      {/* 고정 게시글 섹션 */}
      {stickyPosts.length > 0 && (
        <PostsSection>
          <h3>고정 게시글</h3>
          {stickyPosts.map((post) => (
            <StyledLink
              to={`/forum/post/${post.id}`}
              key={post.id}
              onClick={() => ForumApi.incrementViewCount(post.id)}
            >
              <PostCard>
                <div>
                  <PostTitle>{post.title}</PostTitle>
                  <PostMeta>
                    작성일: {new Date(post.createdAt).toLocaleDateString()}
                  </PostMeta>
                  <PostDetails>작성자: {post.authorName}</PostDetails>
                </div>
                <PostRightSection>
                  <PostStat>조회수: {post.viewsCount}</PostStat>
                  <PostStat>좋아요: {post.likesCount}</PostStat>
                  {/* 최신 댓글 표시 */}
                  <LatestCommentContainer>
                    {post.latestComment && post.latestComment.content ? (
                      <>
                        <span className="comment-author">
                          {post.latestComment.authorName}
                        </span>
                        ,{" "}
                        <span className="comment-date">
                          {new Date(
                            post.latestComment.createdAt
                          ).toLocaleDateString()}
                        </span>{" "}
                        - "
                        <span className="comment-preview">
                          {post.latestComment.content.substring(0, 20)}
                        </span>
                        ..."
                      </>
                    ) : (
                      <span className="no-comment">No comments</span>
                    )}
                  </LatestCommentContainer>
                </PostRightSection>
              </PostCard>
            </StyledLink>
          ))}
        </PostsSection>
      )}

      {/* 일반 게시글 섹션 */}
      {posts.length > 0 ? (
        <PostsSection>
          <h3>일반 게시글</h3>
          {posts.map((post) => (
            <StyledLink
              to={`/forum/post/${post.id}`}
              key={post.id}
              onClick={() => ForumApi.incrementViewCount(post.id)}
            >
              <PostCard>
                <div>
                  <PostTitle>{post.title}</PostTitle>
                  <PostMeta>
                    작성일: {new Date(post.createdAt).toLocaleDateString()}
                  </PostMeta>
                  <PostDetails>작성자: {post.authorName}</PostDetails>
                </div>
                <PostRightSection>
                  <PostStat>조회수: {post.viewsCount}</PostStat>
                  <PostStat>좋아요: {post.likesCount}</PostStat>
                  {/* 최신 댓글 표시 (HTML 태그 제거 후 20자 미리보기) */}
                  <LatestCommentContainer>
                    {post.latestComment && post.latestComment.content ? (
                      <>
                        <span className="comment-author">
                          {post.latestComment.authorName}
                        </span>
                        ,{" "}
                        <span className="comment-date">
                          {new Date(
                            post.latestComment.createdAt
                          ).toLocaleDateString()}
                        </span>{" "}
                        - "
                        <span className="comment-preview">
                          {stripHtmlTags(post.latestComment.content).substring(
                            0,
                            20
                          )}
                        </span>
                        ..."
                      </>
                    ) : (
                      <span className="no-comment">No comments</span>
                    )}
                  </LatestCommentContainer>
                </PostRightSection>
              </PostCard>
            </StyledLink>
          ))}
        </PostsSection>
      ) : (
        <p>아직 이 카테고리에는 게시글이 존재하지 않습니다.</p>
      )}
    </PostsContainer>
  );
};

export default ForumPosts;
