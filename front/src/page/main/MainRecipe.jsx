import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const RecipeContainer = styled.div`
  display: flex;
  justify-content: space-evenly; /* 아이템 간격을 균등하게 분배 */
  gap: 30px;
  margin-top: 30px;
`;

const RecipeCard = styled.div`
  position: relative;
  width: 30%;
  height: 350px; /* 카드의 고정된 높이 */
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;

  /* 이미지 스타일 */
  img {
    width: 100%;
    height: 100%; /* 이미지가 카드 높이를 채우도록 */
    object-fit: cover; /* 비율 유지하면서 카드 크기에 맞게 채우기 */
    transition: 0.3s ease;
  }

  /* 이미지 호버 시 어두워지는 효과 */
  &:hover img {
    filter: brightness(50%);
  }

  /* 제목 스타일 */
  .recipe-title {
    position: absolute;
    top: 0; /* 이미지 위로 제목이 덮어지도록 */
    left: 0;
    right: 0;
    color: white;
    font-size: 16px;
    font-weight: bold;
    background-color: rgba(0, 0, 0, 0.6); /* 검정 배경에 반투명 효과 */
    padding: 10px;
    text-align: center;
    width: 100%;
    visibility: hidden;
    transition: visibility 0.3s ease;
    z-index: 1; /* 이미지 위에 제목이 덮어지도록 z-index 추가 */
  }

  /* 마우스 호버 시 제목 보이도록 */
  &:hover .recipe-title {
    visibility: visible;
  }
`;

const CategoryTitle = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: #6f4f1f; /* 따뜻한 갈색 글씨 */
  margin: 20px 0;
  padding: 10px 20px;
  text-align: center; /* 중앙 정렬 */
  width: fit-content; /* 제목이 길어져도 너비는 내용에 맞게 조절 */
  margin-top: 50px; /* 상단 마진 추가 */
  margin-bottom: 10px; /* 하단 마진 추가 */
`;

const Line = styled.div`
  margin: 0 50px;
  height: 2px;
  background-color: #6f4f1f; /* 같은 색으로 실선 추가 */
  margin: 0 auto; /* 가운데 정렬 */
`;

const Recipe = ({ image, title, url }) => {
  const navigate = useNavigate(); // useNavigate hook 사용

  const handleClick = () => {
    navigate(url); // 클릭 시 url로 이동
  };

  return (
    <RecipeCard onClick={handleClick}>
      <img src={image} alt={title} />
      <div className="recipe-title">
        {title.length > 25 ? `${title.slice(0, 25)}...` : title}
      </div>
    </RecipeCard>
  );
};

const Top3Recipes = ({ category, recipes }) => {
  return (
    <div>
      <CategoryTitle>{category}</CategoryTitle>
      <Line /> {/* 실선 추가 */}
      <RecipeContainer>
        {recipes.map((recipe) => (
          <Recipe
            key={recipe.id}
            image={recipe.image}
            title={recipe.title}
            url={recipe.url}
          />
        ))}
      </RecipeContainer>
    </div>
  );
};

export default Top3Recipes;
