import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import ProfileApi from "../../../api/ProfileApi";

const RecipeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 800px;
  margin: auto;
`;

const Card = styled.div`
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Timestamp = styled.span`
  font-size: 12px;
  color: #999;
`;

const ContentType = styled.span`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const LoadingMessage = styled.div`
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

interface Recipe {
  id: string;
  title: string;
  createdAt: string;
  content_type: string;
}

interface Props {
  memberId: string;
}

const UserRecipesList: React.FC<{ memberId: number }> = ({ memberId }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;

  const fetchRecipes = useCallback(async () => {
    if (loading || !hasMore || error) return; // 이미 오류가 발생했거나, 로딩 중이면 다시 요청하지 않음
  
    setLoading(true);
    setError(null); // 오류 초기화
  
    try {
      const newRecipes = await ProfileApi.getUserRecipes(
        memberId,
        page,
        pageSize
      );
      if (newRecipes.length > 0) {
        setRecipes((prev) => [...prev, ...newRecipes]);
      }
      setHasMore(newRecipes.length === pageSize);
      console.log("Response Data:", newRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError("레시피를 불러오는 중 오류가 발생했습니다.");
      setLoading(false); // 오류 발생 시 로딩 중지
    } finally {
      setLoading(false);
    }
  }, [memberId, page, loading, hasMore, error]);
  
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);
  
  if (error || (recipes.length === 0 && !loading)) {
    return (
      <div>
        {error && <LoadingMessage>{error}</LoadingMessage>}
        {!error && recipes.length === 0 && !loading && (
          <LoadingMessage>작성된 레시피가 없습니다.</LoadingMessage>
        )}
      </div>
    );
  }
  
  return (
    <div>
      <RecipeContainer>
        {recipes.map((recipe, index) => (
          <Card key={index}>
            <Title>{recipe.title}</Title>
            <ContentType>{recipe.content_type || "N/A"}</ContentType>
          </Card>
        ))}
      </RecipeContainer>
      {recipes.length > 0 && (
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
            disabled={!hasMore}
          >
            다음 페이지
          </PageButton>
        </Pagination>
      )}
      {loading && <LoadingMessage>로딩 중...</LoadingMessage>}
    </div>
  );
};

export default UserRecipesList;