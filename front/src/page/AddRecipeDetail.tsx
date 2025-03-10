import { useState, ChangeEvent, useEffect } from "react";
import { Upload } from "lucide-react"; // 설치 필요
import React from "react";
import RecipeApi from "../api/RecipeApi";

// 재료와 조리법의 타입 정의
interface Ingredient {
  ingredient: string;
  amount: string;
}

interface Step {
  text: string;
  image: string | null;
}

interface RecipeData {
  type: string;
  name: string;
  rcpWay2: string;
  rcpPat2: string;
  attFileNoMain: string | null;
  rcpNaTip: string;
  rcpPartsDtls: Ingredient[];
  manuals: { text: string; imageUrl: string | null }[];
  authory: number; 
}

export default function RecipeUploader() {
  const [title, setTitle] = useState<string>("");
  const [cookingMethod, setCookingMethod] = useState<string>("");
  const [recipeTip, setRecipeTip] = useState<string>("");
  const [cuisineType, setCuisineType] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ ingredient: "", amount: "" }]);
  const [steps, setSteps] = useState<Step[]>([{ text: "", image: null }]);
  const [image, setImage] = useState<string | null>(null);

  const handleAddIngredient = () => setIngredients([...ingredients, { ingredient: "", amount: "" }]);
  const handleIngredientChange = (index: number, field: "ingredient" | "amount", value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleAddStep = () => setSteps([...steps, { text: "", image: null }]);
  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index].text = value;
    setSteps(newSteps);
  };

  const handleStepImageUpload = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newSteps = [...steps];
        newSteps[index].image = reader.result as string; // base64 문자열로 변환
        setSteps(newSteps);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string); // base64 문자열로 변환
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveIngredient = () => {
    const newIngredients = ingredients.slice(0, -1); // 가장 최근 항목만 삭제
    setIngredients(newIngredients);
  };

  const handleRemoveStep = () => {
    const newSteps = steps.slice(0, -1); // 가장 최근 항목만 삭제
    setSteps(newSteps);
  };

  const handleSaveRecipe = async () => {
    const recipeData: RecipeData = {
      type: "food",
      name: title,
      rcpWay2: cookingMethod,
      rcpPat2: cuisineType,
      attFileNoMain: image,
      rcpNaTip: recipeTip,
      rcpPartsDtls: ingredients,
      manuals: steps.map((step) => ({
        text: step.text,
        imageUrl: step.image,
      })),
      authory: 1, 
    };

    try {
      const result = await RecipeApi.saveRecipe(recipeData);
      console.log("레시피 저장 성공:", result);
      alert("레시피가 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("레시피 저장 실패:", error);
      alert("레시피 저장 중 오류가 발생했습니다.");
    };
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
       <div>
        <h2 className="text-lg font-semibold">음식 사진</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="upload"
        />
        <label htmlFor="upload" className="cursor-pointer flex items-center space-x-2 border p-2 rounded-lg">
          <Upload />
          <span>사진 업로드</span>
        </label>
        {image && (
          <div className="border rounded-lg p-4">
            <img src={image} alt="레시피 사진" className="w-full h-auto" />
          </div>
        )}
      </div>
      <input
        type="text"
        placeholder="레시피 제목"
        value={title}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      <input
        type="text"
        placeholder="조리방법"
        value={cookingMethod}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setCookingMethod(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />
      <input
        type="text"
        placeholder="요리 종류"
        value={cuisineType}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setCuisineType(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg"
      />

      <div>
        <h2 className="text-lg font-semibold">재료</h2>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder={`재료 ${index + 1}`}
              value={ingredient.ingredient}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleIngredientChange(index, "ingredient", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder={`양 ${index + 1}`}
              value={ingredient.amount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleIngredientChange(index, "amount", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        ))}
        <button
          onClick={handleAddIngredient}
          className="w-full py-2 bg-blue-500 text-white rounded-lg mt-2"
        >
          재료 추가
        </button>
        {ingredients.length > 1 && (
          <button
            onClick={handleRemoveIngredient}
            className="w-full py-2 bg-red-500 text-white rounded-lg mt-2"
          >
            가장 최근 재료 삭제
          </button>
        )}
      </div>
      
      <div>
        <h2 className="text-lg font-semibold">조리법</h2>
        {steps.map((step, index) => (
          <div key={index} className="space-y-2">
              <label htmlFor={`step-upload-${index}`} className="cursor-pointer flex items-center space-x-2 border p-2 rounded-lg">
              <Upload />
              <span>조리 단계 사진 업로드</span>
            </label>
            <textarea
              placeholder={`조리 단계 ${index + 1}`}
              value={step.text}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleStepChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleStepImageUpload(index, e)}
              className="hidden"
              id={`step-upload-${index}`}
            />
          
            {step.image && (
              <div className="border rounded-lg p-4">
                <img src={step.image} alt={`조리 단계 ${index + 1}`} className="w-full h-auto" />
              </div>
            )}
          </div>
        ))}
        <button
          onClick={handleAddStep}
          className="w-full py-2 bg-blue-500 text-white rounded-lg mt-2"
        >
          조리법 추가
        </button>
        {steps.length > 1 && (
          <button
            onClick={handleRemoveStep}
            className="w-full py-2 bg-red-500 text-white rounded-lg mt-2"
          >
            가장 최근 조리법 삭제
          </button>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold">레시피 팁</h2>
        <textarea
          placeholder="레시피 팁을 입력하세요"
          value={recipeTip}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setRecipeTip(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      

      <button
        className="w-full py-2 bg-blue-500 text-white rounded-lg mt-4"
        onClick={handleSaveRecipe}
      >
        레시피 저장
      </button>
    </div>
  );
}
