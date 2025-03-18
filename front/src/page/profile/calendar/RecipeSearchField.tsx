import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { fetchRecipeList, RecipeListResDto } from "../../../api/RecipeListApi";

interface RecipeSearchFieldProps {
  value: string;
  onChange: (name: string, id: string) => void;
  type: "cocktail" | "food";
}

const RecipeSearchField = ({ value, onChange, type }: RecipeSearchFieldProps) => {
  const [recipes, setRecipes] = useState<RecipeListResDto[] | []>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetchRecipeList("", type, "", "", 1, 1000); // 레시피 목록을 가져오는 API 호출
        setRecipes(response);
      } catch (error) {
        console.error("레시피 목록을 불러오는 데 실패했습니다.", error);
      }
    };

    fetchRecipes();
  }, [type]);

  return (
    <Autocomplete
      freeSolo
      options={recipes.map((recipe) => recipe.name)} // 자동완성 목록에 표시될 레시피 이름
      value={value}
      onChange={(_, newRecipeName) => {
        // 필터를 걸어 선택된 레시피의 id를 찾기
        const selectedRecipe = recipes.find((recipe) => recipe.name === newRecipeName);
        if (selectedRecipe) {
          onChange( selectedRecipe.name, selectedRecipe.id); // id와 name을 전달
        } else {
          onChange("", ""); // 값이 없으면 빈 문자열 전달
        }
      }}
      renderInput={(params) => <TextField {...params} label="레시피명" variant="outlined" />}
      sx={{ width: "100%" }}
    />
  );
};

export default RecipeSearchField;
