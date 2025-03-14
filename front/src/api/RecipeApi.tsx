
import axiosInstance from "./AxiosInstance";

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
};

export default RecipeApi;