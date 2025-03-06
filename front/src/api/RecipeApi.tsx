import axiosInstance from "./AxiosInstance";
import axios from "axios";
import Commons from "../util/Common";


const RecipeApi = {
    saveRecipe : async (recipeData: any) => {
        try {
        const response = await axiosInstance.post("/recipe/save-recipe", recipeData);
          return response.data;
        } catch (error) {
          console.error("레시피 저장 실패:", error);
          throw error;
        }
 }
}
export default RecipeApi