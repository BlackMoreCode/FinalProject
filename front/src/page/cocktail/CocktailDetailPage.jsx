import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCocktailDetail } from "../../api/CocktailApi";

/**
 * 칵테일 상세 페이지
 * <p>URL 파라미터(:id)를 사용하여 백엔드로부터 상세 정보를 가져오고, 화면에 표시</p>
 */
const CocktailDetailPage = () => {
  const [cocktail, setCocktail] = useState(null);
  const { id } = useParams(); // URL 파라미터에서 id 추출
  const navigate = useNavigate(); // 뒤로 가기 등에 사용

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await fetchCocktailDetail(id); // /test/detail/{id}?type=cocktail 호출
        setCocktail(data);
      } catch (error) {
        console.error("칵테일 상세 조회 실패:", error);
      }
    };
    fetchDetail();
  }, [id]);

  if (!cocktail) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  // ingredients가 배열이 아닐 수도 있으므로 안전하게 처리
  const ingredients = Array.isArray(cocktail.ingredients)
    ? cocktail.ingredients
    : [];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >
        Back to list
      </button>
      <h1 className="text-3xl font-bold mb-4">{cocktail.name}</h1>
      <img
        src={cocktail.image}
        alt={cocktail.name}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <div className="mb-4">
        <p className="text-gray-700">
          <span className="font-semibold">Category:</span> {cocktail.category}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Description:</span>{" "}
          {cocktail.description}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">ABV:</span> {cocktail.abv}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Garnish:</span> {cocktail.garnish}
        </p>
      </div>
      <h3 className="text-2xl font-semibold mb-2">Ingredients</h3>
      <ul className="list-disc ml-6">
        {ingredients.map((ing, index) => (
          <li key={index} className="text-gray-700">
            {ing.ingredient} - {ing.amount} {ing.unit}{" "}
            {ing.special && `(${ing.special})`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CocktailDetailPage;
