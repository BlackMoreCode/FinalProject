import { useState, ChangeEvent } from "react";
import { Upload } from "lucide-react"; // 설치 필요
import React from "react";
import RecipeApi from "../../api/RecipeApi";

interface Ingredient {
  ingredient: string;
  amount: string;
  unit: string;
}

const AddCockTailDetail =()=>{
  const [name, setName] = useState<string>("");
  const [glass, setGlass] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { ingredient: "", amount: "", unit: ""},
  ]);
  const [garnish, setGarnish] = useState<string>("");
  const [preparation, setPreparation] = useState<string>("");
  const [abv, setAbv] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  // 재료 추가
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredient: "", amount: "", unit: ""}]);
  };

  // 재료 입력 변경
  const handleIngredientChange = (index: number, field: "ingredient" | "amount" |"unit" , value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };


  // 대표 이미지 업로드
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file); // 메인 이미지를 파일로 저장
    }
  };

  // 칵테일 레시피 저장
  const handleSaveCocktail = async () => {
    const formData = new FormData();
    
    // 기본 필드
    formData.append("name", name);
    formData.append("glass", glass);
    formData.append("category", category);
    formData.append("garnish", garnish);
    formData.append("preparation", preparation);
    formData.append("abv", abv);
  
    // 재료 추가
    ingredients.forEach((ingredient, index) => {
        formData.append(`ingredients[${index}].ingredient`, ingredient.ingredient);
        formData.append(`ingredients[${index}].amount`, ingredient.amount);
        formData.append(`ingredients[${index}].unit`, ingredient.unit);
      
      });
  
    // 이미지 추가 (파일 업로드)
    if (image) {
      formData.append("image", image); // image는 input[type="file"]에서 선택된 파일
    }
  
    // 타입 추가
    formData.append("type", "cocktail");
  
    try {
      const result = await RecipeApi.saveCocktailRecipe(formData);
      console.log("레시피 저장 성공:", result);
      alert("레시피가 성공적으로 저장되었습니다.");
  } catch (error) {
      console.error("레시피 저장 실패:", error);
      alert("레시피 저장 중 오류가 발생했습니다.");
  }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
          <div>
        <h2 className="text-lg font-semibold">칵테일 사진</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="upload"
        />
      
        {image && (
          <div className="mt-2">
            <img src={URL.createObjectURL(image)} alt="칵테일 사진" className="w-full h-auto rounded" />
          </div>
        )}

        <label
          htmlFor="upload"
          className="cursor-pointer flex items-center space-x-2 border p-2 rounded-lg"
        >
          <Upload />
          <span>사진 업로드</span>
        </label>
        
      </div>
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
              placeholder={`재료`}
              value={ingredient.ingredient}
              onChange={(e) => handleIngredientChange(index, "ingredient", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder={`양`}
              value={ingredient.amount}
              onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder={`단위`}
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
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
      <button
        onClick={handleSaveCocktail}
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        칵테일 레시피 저장
      </button>
    </div>
  );
}
export default AddCockTailDetail;