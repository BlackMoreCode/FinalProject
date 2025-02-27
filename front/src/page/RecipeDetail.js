import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RecipeDetail({ match }) {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`/detail/${match.params.id}?type=${match.params.type}`);
                setRecipe(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch recipe details');
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [match.params.id, match.params.type]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>{recipe.name}</h1>
            <img src={recipe.ATT_FILE_NO_MAIN} alt={recipe.name} />
            <p>{recipe.RCP_WAY2}</p>
            <p>{recipe.RCP_PAT2}</p>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient.ingredient}: {ingredient.amount}</li>
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
}

export default RecipeDetail;