import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function RecipeUploader() {
  const [title, setTitle] = useState("");
  const [cookingMethod, setCookingMethod] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [ingredients, setIngredients] = useState([{ ingredient: "", amount: "" }]); // 재료와 양을 분리하여 관리
  const [steps, setSteps] = useState([{ text: "", image: null }]);
  const [image, setImage] = useState(null);

  // 재료 추가
  const handleAddIngredient = () => setIngredients([...ingredients, { ingredient: "", amount: "" }]);

  // 재료 입력 변경
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // 조리법 추가
  const handleAddStep = () => setSteps([...steps, { text: "", image: null }]);

  // 조리법 텍스트 변경
  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].text = value;
    setSteps(newSteps);
  };

  // 조리법 이미지 업로드
  const handleStepImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newSteps = [...steps];
        newSteps[index].image = reader.result;
        setSteps(newSteps);
      };
      reader.readAsDataURL(file);
    }
  };

  // 대표 이미지 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 레시피 저장
  const handleSaveRecipe = async () => {
    const recipeData = {
      type: "food", // 필요에 따라 수정
      name: title,
      rcpWay2: cookingMethod,
      rcpPat2: cuisineType,
      infoWgt: "중량 정보", // 필요에 따라 수정
      attFileNoMain: image, // 대표 이미지 (Base64)
      attFileNoMk: image, // 대표 이미지 (Base64)
      rcpNaTip: "레시피 팁", // 필요에 따라 수정
      rcpPartsDtls: ingredients, // 재료와 양
      manuals: steps.map((step) => ({
        text: step.text,
        imageUrl: step.image, // 조리법 이미지 (Base64)
      })),
      authory: 1, // 필요에 따라 수정 (예: 사용자 ID)
    };

    try {
      const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await fetch("/api/save-recipe", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("레시피 저장 성공:", result);
        alert("레시피가 성공적으로 저장되었습니다.");
      } else {
        console.error("레시피 저장 실패:", response.statusText);
        alert("레시피 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("레시피 저장 중 오류 발생:", error);
      alert("레시피 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <Input placeholder="레시피 제목" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input placeholder="조리방법" value={cookingMethod} onChange={(e) => setCookingMethod(e.target.value)} />
      <Input placeholder="요리 종류" value={cuisineType} onChange={(e) => setCuisineType(e.target.value)} />
      
      <div>
        <h2 className="text-lg font-semibold">재료</h2>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="space-y-2">
            <Input
              placeholder={`재료 ${index + 1}`}
              value={ingredient.ingredient}
              onChange={(e) => handleIngredientChange(index, "ingredient", e.target.value)}
            />
            <Input
              placeholder={`양 ${index + 1}`}
              value={ingredient.amount}
              onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
            />
          </div>
        ))}
        <Button onClick={handleAddIngredient}>재료 추가</Button>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold">조리법</h2>
        {steps.map((step, index) => (
          <div key={index} className="space-y-2">
            <Textarea
              placeholder={`조리 단계 ${index + 1}`}
              value={step.text}
              onChange={(e) => handleStepChange(index, e.target.value)}
            />
            <input type="file" accept="image/*" onChange={(e) => handleStepImageUpload(index, e)} className="hidden" id={`step-upload-${index}`} />
            <label htmlFor={`step-upload-${index}`} className="cursor-pointer flex items-center space-x-2 border p-2 rounded-lg">
              <Upload />
              <span>조리 단계 사진 업로드</span>
            </label>
            {step.image && <Card><CardContent><img src={step.image} alt={`조리 단계 ${index + 1}`} className="w-full h-auto" /></CardContent></Card>}
          </div>
        ))}
        <Button onClick={handleAddStep}>조리법 추가</Button>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold">음식 사진</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="upload" />
        <label htmlFor="upload" className="cursor-pointer flex items-center space-x-2 border p-2 rounded-lg">
          <Upload />
          <span>사진 업로드</span>
        </label>
        {image && <Card><CardContent><img src={image} alt="레시피 사진" className="w-full h-auto" /></CardContent></Card>}
      </div>
      
      <Button className="w-full" onClick={handleSaveRecipe}>레시피 저장</Button>
    </div>
  );
}