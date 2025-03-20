import axios from "axios"
import axiosInstance from "./AxiosInstance";
import { FoodResDto,CocktailResDto,CocktailIngDto } from "./dto/RecipeDto";

const RecipeApi = {
    saveRecipe: async (formData: FormData) => { // formData의 타입을 FormData로 지정
        try {
            const response = await axiosInstance.post("/recipe/save-recipe", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // 멀티파트 폼 데이터로 전송
                },
            });
            return response.data;
        } catch (error) {
            console.error("레시피 저장 실패:", error);
            throw error;
        }
    },
    saveCocktailRecipe: async (formData: FormData) => { // formData의 타입을 FormData로 지정
      try {
          const response = await axiosInstance.post("/recipe/save-cocktail-recipe", formData, {
              headers: {
                  "Content-Type": "multipart/form-data", // 멀티파트 폼 데이터로 전송
              },
          });
          return response.data;
      } catch (error) {
          console.error("레시피 저장 실패:", error);
          throw error;
      }
  },

  updateCocktailRecipe: async (formData: FormData) => { // formData의 타입을 FormData로 지정
    try {
        const response = await axiosInstance.post("/recipe/update-cocktail-recipe", formData, {
            headers: {
                "Content-Type": "multipart/form-data", // 멀티파트 폼 데이터로 전송
            },
        });
        return response.data;
    } catch (error) {
        console.error("레시피 저장 실패:", error);
        throw error;
    }
},
updateFoodRecipe: async (formData: FormData) => { // formData의 타입을 FormData로 지정
    try {
        const response = await axiosInstance.post("/recipe/update-recipe", formData, {
            headers: {
                "Content-Type": "multipart/form-data", // 멀티파트 폼 데이터로 전송
            },
        });
        return response.data;
    } catch (error) {
        console.error("레시피 저장 실패:", error);
        throw error;
    }
},



   fetchRecipeDetail : async (id: string, type: string): Promise<FoodResDto> => {
    const response = await axios.get<FoodResDto>(`http://localhost:8111/test/detail/${id}?type=${type}`);
    return response.data;
},

fetchCocktail : async (id: string, type: string): Promise<CocktailResDto> => {
    const response = await axios.get<CocktailResDto>(`http://localhost:8111/test/detail/${id}?type=${type}`);
    return response.data;
},
};

export default RecipeApi;