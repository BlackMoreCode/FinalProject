import React, { useEffect, useState, ChangeEvent } from 'react';
import { Upload } from "lucide-react"; // 설치 필요
import { useParams, useNavigate } from "react-router-dom";
import RecipeApi from "../../api/RecipeApi";
import { CocktailResDto } from '../../api/dto/RecipeDto';

interface Ingredient {
  ingredient: string;
  amount: number;
  unit: string;
}

const EditCockTailRecipe: React.FC = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<CocktailResDto | null>(null);
  const [name, setName] = useState<string>("");
  const [glass, setGlass] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [garnish, setGarnish] = useState<string>("");
  const [preparation, setPreparation] = useState<string>("");
  const [abv, setAbv] = useState<string | number>(""); // abv를 string | number로 변경
  const [image, setImage] = useState<string | File | null>(null); // image를 string | File | null로 변경
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCocktailDetail = async () => {
      try {
        const data = await RecipeApi.fetchCocktail(id!, type!);
        
        setRecipe(data);
        setImage(data.image); // data.image는 string일 가능성 있음
        setName(data.name);
        setGlass(data.glass);
        setCategory(data.category);
        setIngredients(data.ingredients?.map((ingredient) => ({
          ingredient: ingredient.ingredient,
          amount: ingredient.amount, // 숫자에서 문자열로 변환
          unit: ingredient.unit,
        })) || []);
        setGarnish(data.garnish);
        setPreparation(data.preparation);
        setAbv(data.abv);
      } catch (err) {
        setError("칵테일 상세 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCocktailDetail();
  }, [id, type]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredient: "", amount: 0, unit: "" }]);
  };
  
  const handleIngredientChange = (index: number, field: "ingredient" | "amount" | "unit", value: string) => {
    const newIngredients = [...ingredients];
    if (field === "amount") {
      newIngredients[index][field] = parseFloat(value); // 숫자로 변환
    } else {
      newIngredients[index][field] = value;
    }
    setIngredients(newIngredients);
  };
  

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUpdateCocktail = async () => {
    const formData = new FormData();
    formData.append('type',type!)
    formData.append('postId', id!);
    formData.append("name", name);
    formData.append("glass", glass);
    formData.append("category", category);
    formData.append("garnish", garnish);
    formData.append("preparation", preparation);
    formData.append("abv", abv.toString()); // abv는 string으로 변환

    ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}].ingredient`, ingredient.ingredient);
      formData.append(`ingredients[${index}].amount`, ingredient.amount.toString());
      formData.append(`ingredients[${index}].unit`, ingredient.unit);
    });

    if (image && image instanceof File) {
      formData.append('image', image);
    } else if (recipe?.image) {
      formData.append('existingImage', recipe.image);
    }

    try {
      const result = await RecipeApi.updateCocktailRecipe(formData);
      console.log("칵테일 레시피 수정 성공:", result);
      alert("칵테일 레시피가 성공적으로 수정되었습니다.");
      navigate("/"); // 홈으로 네비게이트
    } catch (error) {
      console.error("칵테일 레시피 수정 실패:", error);
      alert("칵테일 레시피 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
        {image ? (
          <div className="mt-2">
            <img src={image instanceof File ? URL.createObjectURL(image) : image} alt="칵테일 사진" className="w-full h-auto rounded" />
          </div>
        ) : (
          <div className="mt-2">
            <img src={recipe?.image || ""} alt="칵테일 사진" className="w-full h-auto rounded" />
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
        onClick={handleUpdateCocktail}
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        칵테일 레시피 수정
      </button>
    </div>
  );
};

export default EditCockTailRecipe;
