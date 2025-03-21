import React, { useEffect, useState } from "react";
import UserPost from "./UserPost";
import ProfileApi from "../../../api/ProfileApi";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: auto;
`;

const Message = styled.p`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-top: 20px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const PageButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease-in-out;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #0056b3;
  }
`;

interface ForumPostResponseDto {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const UserPostList: React.FC<{ memberId: number }> = ({ memberId }) => {
  const [posts, setPosts] = useState<ForumPostResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0); // 페이지 상태 추가
  const pageSize = 10; // 한 페이지에 보여줄 개수

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await ProfileApi.getUserPosts(
          memberId,
          page,
          pageSize
        );
        setPosts(response.data);
        console.log("Response Data:", response.data);
      } catch (err) {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [memberId, page]); // page 상태가 변경될 때마다 다시 호출

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      {posts.length === 0 ? (
        <Message>작성한 글이 없습니다.</Message>
      ) : (
        <>
          <UserPost posts={posts} />
          <Pagination>
            <PageButton
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
            >
              이전 페이지
            </PageButton>
            <span>페이지 {page + 1}</span>
            <PageButton
              onClick={() => setPage((prev) => prev + 1)}
              disabled={posts.length < pageSize}
            >
              다음 페이지
            </PageButton>
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default UserPostList;
