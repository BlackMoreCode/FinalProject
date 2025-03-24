import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
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
  display: flex;
  justify-content: space-between;
  align-items: center;

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

const ContentType = styled.span`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const EditButton = styled.button`
  background: #6a4e23;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease-in-out;

  &:hover {
    background: #d1b6a3;
  }
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
  content_type: string;
}

interface Props {
  memberId: number;
}

const UserRecipesList: React.FC<Props> = ({ memberId }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10;
  const navigate = useNavigate();

  const fetchRecipes = useCallback(async () => {
    if (loading || !hasMore || error) return;
    setLoading(true);
    setError(null);

    try {
      const newRecipes = await ProfileApi.getUserRecipes(memberId, page, pageSize);
      if (newRecipes.length > 0) {
        setRecipes((prev) => [...prev, ...newRecipes]);
      }
      setHasMore(newRecipes.length === pageSize);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError("레시피를 불러오는 중 오류가 발생했습니다.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [memberId, page]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleEdit = (id: string, contentType: string) => {
    if (contentType === "food") {
      navigate(`/foodrecipe/edit/${id}/food`);
    } else if (contentType === "cocktail") {
      navigate(`/cocktailrecipe/edit/${id}/cocktail`);
    } else {
      console.error("Unknown recipe type:", contentType);
    }
  };

  const handleCardClick = (id: string, contentType: string) => {
    if (contentType === "food") {
      navigate(`/foodrecipe/detail/${id}/${contentType}`);
    } else if (contentType === "cocktail") {
      navigate(`/cocktailrecipe/detail/${id}/${contentType}`);
    } else {
      console.error("Unknown recipe type:", contentType);
    }
  };

  return (
    <div>
      <RecipeContainer>
        {recipes.map((recipe) => (
          <Card key={recipe.id} onClick={() => handleCardClick(recipe.id, recipe.content_type)}>
            <div>
              <Title>{recipe.title}</Title>
              <ContentType>{recipe.content_type || "N/A"}</ContentType>
            </div>
            <EditButton onClick={(e) => { 
                e.stopPropagation(); // 클릭 시 카드 클릭 이벤트가 발생하지 않도록 방지
                handleEdit(recipe.id, recipe.content_type);
              }}>
              수정
            </EditButton>
          </Card>
        ))}
      </RecipeContainer>
      {recipes.length > 0 && (
        <Pagination>
          <PageButton onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>
            이전 페이지
          </PageButton>
          <span>페이지 {page + 1}</span>
          <PageButton onClick={() => setPage((prev) => prev + 1)} disabled={!hasMore}>
            다음 페이지
          </PageButton>
        </Pagination>
      )}
      {loading && <LoadingMessage>로딩 중...</LoadingMessage>}
    </div>
  );
};

export default UserRecipesList;
