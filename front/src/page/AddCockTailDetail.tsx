import { useState } from "react";
import { Upload } from "lucide-react";
import React from "react";

interface Ingredient {
  ingredient: string;
  amount: string;
  unit: string;
  special: string;
}

export default function CocktailUploader() {
  const [name, setName] = useState<string>("");
  const [glass, setGlass] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { ingredient: "", amount: "", unit: "", special: "" },
  ]);
  const [garnish, setGarnish] = useState<string>("");
  const [preparation, setPreparation] = useState<string>("");
  const [abv, setAbv] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);

  // 재료 추가
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredient: "", amount: "", unit: "", special: "" }]);
  };

  // 재료 입력 변경
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // 대표 이미지 업로드
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 칵테일 레시피 저장
  const handleSaveCocktail = async () => {
    const cocktailData = {
      name,
      glass,
      category,
      ingredients: ingredients.map((ing) => ({
        ingredient: ing.ingredient,
        amount: parseFloat(ing.amount), // amount는 float 타입
        unit: ing.unit,
        special: ing.special,
      })),
      garnish,
      preparation,
      abv: parseFloat(abv), // abv는 float 타입
      like: 0, // 기본값
      report: 0, // 기본값
      author: 1, // 필요에 따라 수정 (예: 사용자 ID)
      image, // Base64 이미지
    };

    try {
      const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await fetch("/api/save-cocktail", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cocktailData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("칵테일 레시피 저장 성공:", result);
        alert("칵테일 레시피가 성공적으로 저장되었습니다.");
      } else {
        console.error("칵테일 레시피 저장 실패:", response.statusText);
        alert("칵테일 레시피 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("칵테일 레시피 저장 중 오류 발생:", error);
      alert("칵테일 레시피 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <input
        type="text"
        placeholder="칵테일 이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="잔 종류"
        value={glass}
        onChange={(e) => setGlass(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="카테고리"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="가니시"
        value={garnish}
        onChange={(e) => setGarnish(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="준비 방법"
        value={preparation}
        onChange={(e) => setPreparation(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="알코올 도수 (ABV)"
        value={abv}
        onChange={(e) => setAbv(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <div>
        <h2 className="text-lg font-semibold">재료</h2>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="space-y-2">
            <input
              type="text"
              placeholder={`재료 ${index + 1}`}
              value={ingredient.ingredient}
              onChange={(e) => handleIngredientChange(index, "ingredient", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder={`양 ${index + 1}`}
              value={ingredient.amount}
              onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder={`단위 ${index + 1}`}
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder={`특수 요청 ${index + 1}`}
              value={ingredient.special}
              onChange={(e) => handleIngredientChange(index, "special", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <button
          onClick={handleAddIngredient}
          className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          재료 추가
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold">칵테일 사진</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="upload"
        />
        <label
          htmlFor="upload"
          className="cursor-pointer flex items-center space-x-2 border p-2 rounded-lg"
        >
          <Upload />
          <span>사진 업로드</span>
        </label>
        {image && (
          <div className="mt-2">
            <img src={image} alt="칵테일 사진" className="w-full h-auto rounded" />
          </div>
        )}
      </div>

      <button
        onClick={handleSaveCocktail}
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        칵테일 레시피 저장
      </button>
    </div>
  );
}