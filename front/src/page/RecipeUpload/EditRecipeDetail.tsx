import React, { useEffect, useState, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';
import { Upload } from 'lucide-react';
import RecipeApi from '../../api/RecipeApi';
import { FoodResDto } from '../../api/dto/RecipeDto';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가

interface Ingredient {
  ingredient: string;
  amount: string;
}

interface Step {
  text: string;
  imageUrl: string;
  image?: File | null;
}

const EditRecipeDetail: React.FC = () => {
  const { id, type } = useParams<{ id: string; type: string }>();
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [recipe, setRecipe] = useState<FoodResDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [cookingMethod, setCookingMethod] = useState<string>('');
  const [recipeTip, setRecipeTip] = useState<string>('');
  const [cuisineType, setCuisineType] = useState<string>('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const data = await RecipeApi.fetchRecipeDetail(id!, type!);
        setRecipe(data);
        setTitle(data.name);
        setCookingMethod(data.cookingMethod);
        setRecipeTip(data.description);
        setCuisineType(data.category);
        setIngredients(data.ingredients || []);
        setSteps(data.instructions || []);
      } catch (err) {
        setError('레시피 상세 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    getRecipe();
  }, [id, type]);

  const handleAddIngredient = () => setIngredients([...ingredients, { ingredient: '', amount: '' }]);

  const handleIngredientChange = (index: number, field: 'ingredient' | 'amount', value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleAddStep = () => setSteps([...steps, { text: '', imageUrl: '', image: null }]);

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index].text = value;
    setSteps(newSteps);
  };

  const handleStepImageUpload = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newSteps = [...steps];
      newSteps[index].image = file;
      setSteps(newSteps);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveIngredient = () => {
    const newIngredients = ingredients.slice(0, -1);
    setIngredients(newIngredients);
  };

  const handleRemoveStep = () => {
    const newSteps = steps.slice(0, -1);
    setSteps(newSteps);
  };

  const handleUpdateRecipe = async () => {
    const formData = new FormData();
    formData.append('postId', id!);
    formData.append('type', type!);
    formData.append('name', title);
    formData.append('rcpWay2', cookingMethod);
    formData.append('rcpPat2', cuisineType);
    formData.append('rcpNaTip', recipeTip);
    formData.append('authory', '1'); // 예시로 1을 사용
  
    // Ingredients
    ingredients.forEach((ingredient, index) => {
      formData.append(`Ingredients[${index}].ingredient`, ingredient.ingredient);
      formData.append(`Ingredients[${index}].amount`, ingredient.amount);
    });
  
    // Manuals
    steps.forEach((step, index) => {
      formData.append(`manuals[${index}].text`, step.text);
  
      // 기존 이미지 URL과 새로 추가한 이미지 파일 구분
      if (step.image) {
        // 새로 추가한 이미지 파일
        formData.append(`manuals[${index}].newImageFile`, step.image);
      } else if (step.imageUrl) {
        // 기존 이미지 URL
        formData.append(`manuals[${index}].existingImageUrl`, step.imageUrl);
      }
    });
  
    // 메인 이미지 처리
    if (image) {
      // 새로 추가한 메인 이미지 파일
      formData.append('attFileNoMain', image);
    } else if (recipe?.image) {
      // 기존 메인 이미지 URL
      formData.append('existingMainImageUrl', recipe.image);
    }
  
    try {
      const result = await RecipeApi.updateFoodRecipe(formData);
      console.log('레시피 수정 성공:', result);
      alert('레시피가 성공적으로 수정되었습니다.');
      navigate('/'); // 홈으로 네비게이트
    } catch (error) {
      console.error('레시피 수정 실패:', error);
      alert('레시피 수정 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!recipe) return <Alert severity="warning">레시피를 찾을 수 없습니다.</Alert>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 3 }}>
            레시피 수정
          </Typography>

          <div>
            <h2 className="text-lg font-semibold">음식 사진</h2>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="upload" />
            {image ? (
              <div className="border rounded-lg p-4">
                <img src={URL.createObjectURL(image)} alt="레시피 사진" className="w-full h-auto" />
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <img src={recipe.image} alt="레시피 사진" className="w-full h-auto" />
              </div>
            )}
            <label htmlFor="upload" className="cursor-pointer flex items-center space-x-2 border p-2 rounded-lg">
              <Upload />
              <span>사진 업로드</span>
            </label>
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleIngredientChange(index, 'ingredient', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder={`양 ${index + 1}`}
                  value={ingredient.amount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleIngredientChange(index, 'amount', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
            <button
              onClick={handleAddIngredient}
              className="w-full py-2 bg-[#6a4e23] text-white rounded-lg mt-2"
            >
              재료 추가
            </button>
            {ingredients.length > 1 && (
              <button
                onClick={handleRemoveIngredient}
                className="w-full py-2 bg-[#d1b6a3] text-white rounded-lg mt-2"
              >
                가장 최근 재료 삭제
              </button>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold">조리법</h2>
            {steps.map((step, index) => (
              <div key={index} className="space-y-2">
                {step.image ? (
                  <div className="border rounded-lg p-4">
                    <img src={URL.createObjectURL(step.image)} alt={`조리 단계 ${index + 1}`} className="w-full h-auto" />
                  </div>
                ) : step.imageUrl ? (
                  <div className="border rounded-lg p-4">
                    <img src={step.imageUrl} alt={`조리 단계 ${index + 1}`} className="w-full h-auto" />
                  </div>
                ) : null}
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
                <label htmlFor={`step-upload-${index}`} className="cursor-pointer flex items-center space-x-2 border p-2 rounded-lg">
                  <Upload />
                  <span>조리 단계 사진 업로드</span>
                </label>
              </div>
            ))}
            <button
              onClick={handleAddStep}
              className="w-full py-2 bg-[#6a4e23] text-white rounded-lg mt-2"
            >
              조리법 추가
            </button>
            {steps.length > 1 && (
              <button
                onClick={handleRemoveStep}
                className="w-full py-2 bg-[#d1b6a3] text-white rounded-lg mt-2"
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

          <Button
  variant="contained"
  onClick={handleUpdateRecipe}
  sx={{
    width: '100%', 
    mt: 2,
    backgroundColor: '#6a4e23',  // 색상을 #6a4e23으로 설정
    '&:hover': {
      backgroundColor: '#d1b6a3', // hover 시 색상 변경 (약간 어두운 색)
    },
  }}
>
  레시피 수정
</Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditRecipeDetail;
