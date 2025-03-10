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

const ForumPosts = () => {
  const { categoryId } = useParams(); // URL에서 카테고리 ID 가져오기
  const [posts, setPosts] = useState([]); // 일반 게시글 상태
  const [stickyPosts, setStickyPosts] = useState([]); // 고정 게시글 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [categoryName, setCategoryName] = useState(""); // 카테고리 이름 상태

  // HTML 태그 제거 함수 (댓글 미리보기에서 사용)
  const stripHtmlTags = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  /**
   * API 호출: 특정 카테고리의 게시글과 카테고리 정보를 가져옵니다.
   * - ForumApi.getPostsByCategoryId 함수는 페이지 번호를 1부터 시작하도록 변경되었습니다.
   *   (즉, 첫 페이지의 경우 page=1, 계산 시 (1-1)*size = 0)
   * - 검색 결과가 비어 있을 경우, 콘솔에 로그를 남깁니다.
   */
  const fetchPosts = async () => {
    try {
      // 게시글 데이터를 가져올 때, 페이지 번호를 1로 설정하여 첫 페이지 호출
      const data = await ForumApi.getPostsByCategoryId(categoryId, 1, 10);
      console.log("검색된 게시글 데이터:", data);

      // data가 PaginationDto 형식이면 content 배열을 사용, 아니면 data 자체가 배열일 수 있음
      const postList = data.content || data.data || [];
      console.log("게시글 목록:", postList);

      // 비어있는 경우 로그 출력 (디버깅 용)
      if (postList.length === 0) {
        console.warn("검색 결과가 없습니다. (게시글 목록이 비어 있음)");
      }

      // 고정 게시글과 일반 게시글을 분리
      setStickyPosts(postList.filter((post) => post.sticky));
      setPosts(postList.filter((post) => !post.sticky));

      // 카테고리 이름 가져오기
      const category = await ForumApi.getCategoryById(categoryId);
      console.log("가져온 카테고리 정보:", category);
      setCategoryName(category.name);
    } catch (error) {
      console.error("게시글 데이터를 가져오는데 실패했습니다.", error);
    } finally {
      setLoading(false);
    }
  };

  // categoryId 변경 또는 컴포넌트가 처음 렌더링될 때 fetchPosts 호출
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
