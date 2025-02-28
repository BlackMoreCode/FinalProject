import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// 재료 DTO 타입 정의
interface IngredientDto {
    ingredient: string;
    amount: string;
}

// 조리 과정 DTO 타입 정의
interface ManualDto {
    text: string;
    imageUrl: string;
}

// 레시피 상세 정보 DTO 타입 정의
interface FoodResDto {
    name: string;
    RCP_WAY2: string;
    RCP_PAT2: string;
    RCP_NA_TIP: string;
    ingredients: IngredientDto[];
    manuals: ManualDto[];
    ATT_FILE_NO_MAIN: string;
    ATT_FILE_NO_MK: string;
    like: number;
    report: number;
    author: number;
}

const RecipeDetail: React.FC = () => {
    const [recipe, setRecipe] = useState<FoodResDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { id, type } = useParams<{ id: string; type: string }>();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get<FoodResDto>(`/detail/${id}?type=${type}`);
                setRecipe(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch recipe details');
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id, type]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!recipe) return <div>No recipe found</div>;

    return (
        <div>
            <h1>{recipe.name}</h1>
            <img src={recipe.ATT_FILE_NO_MAIN} alt={recipe.name} />
            <p>{recipe.RCP_WAY2}</p>
            <p>{recipe.RCP_PAT2}</p>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                        {ingredient.ingredient}: {ingredient.amount}
                    </li>
                ))}
            </ul>
            <div>
                {recipe.manuals.map((manual, index) => (
                    <div key={index}>
                        <p>{manual.text}</p>
                        <img src={manual.imageUrl} alt={`Step ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipeDetail;