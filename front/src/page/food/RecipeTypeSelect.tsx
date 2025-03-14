
import { useNavigate } from "react-router-dom";
import React from "react";

export default function RecipeTypeSelect() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-2xl font-bold">추가할 레시피를 선택하세요</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/foodrecipe/upload")}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          🍽 음식 레시피 추가
        </button>
        <button
          onClick={() => navigate("/cocktailrecipe/upload")}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          🍸 칵테일 레시피 추가
        </button>
      </div>
    </div>
  );
}
