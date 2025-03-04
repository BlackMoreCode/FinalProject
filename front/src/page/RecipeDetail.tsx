    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import { useParams } from 'react-router-dom';
    import { Card, CardContent, CardMedia, Typography, List, ListItem, ListItemText, Box, CircularProgress, Alert } from '@mui/material';

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
        //     const fetchRecipe = async () => {
        //         try {
        //             const response = await axios.get<FoodResDto>(`/detail/${id}?type=${type}`);
        //             setRecipe(response.data);
        //             setLoading(false);
        //         } catch (err) {
        //             setError('레시피 상세 정보를 불러오는 데 실패했습니다.');
        //             setLoading(false);
        //         }
        //     };

        //     fetchRecipe();
        // }, [id, type]);

        const dummyRecipe: FoodResDto = {
            name: "더미 레시피",
            RCP_WAY2: "볶음",
            RCP_PAT2: "한식",
            RCP_NA_TIP: "맛있게 먹는 방법은 간장을 추가하는 것입니다.",
            ingredients: [
                { ingredient: "돼지고기", amount: "200g" },
                { ingredient: "양파", amount: "1개" },
                { ingredient: "간장", amount: "2T" }
            ],
            manuals: [
                { text: "돼지고기를 적당한 크기로 썬다.", imageUrl: "" },
                { text: "양파를 채 썬다.", imageUrl: "" },
                { text: "팬에 기름을 두르고 돼지고기를 볶는다.", imageUrl: "" },
                { text: "간장과 양파를 넣고 볶아준다.", imageUrl: "" }
            ],
            ATT_FILE_NO_MAIN: "https://via.placeholder.com/300", // 임시 이미지
            ATT_FILE_NO_MK: "",
            like: 10,
            report: 1,
            author: 1234
        };
    
        setRecipe(dummyRecipe);
        setLoading(false);
    }, [id, type]);

        if (loading) return <CircularProgress />;
        if (error) return <Alert severity="error">{error}</Alert>;
        if (!recipe) return <Alert severity="warning">레시피를 찾을 수 없습니다.</Alert>;

        return (
            <Box sx={{ maxWidth: 800, margin: 'auto', padding: 3 }}>
                <Card>
                    <CardMedia
                        component="img"
                        height="300"
                        image={recipe.ATT_FILE_NO_MAIN}
                        alt={recipe.name}
                    />
                    <CardContent>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {recipe.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            조리 방법: {recipe.RCP_WAY2}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            요리 종류: {recipe.RCP_PAT2}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            팁: {recipe.RCP_NA_TIP}
                        </Typography>

                        <Typography variant="h6" component="h2" gutterBottom>
                            재료
                        </Typography>
                        <List>
                            {recipe.ingredients.map((ingredient, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={`${ingredient.ingredient}: ${ingredient.amount}`}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <Typography variant="h6" component="h2" gutterBottom>
                            조리 과정
                        </Typography>
                        {recipe.manuals.map((manual, index) => (
                            <Box key={index} sx={{ marginBottom: 3 }}>
                                <Typography variant="body1" gutterBottom>
                                    {`${index + 1}. ${manual.text}`}
                                </Typography>
                                {manual.imageUrl && (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={manual.imageUrl}
                                        alt={`조리 과정 ${index + 1}`}
                                        sx={{ marginTop: 2 }}
                                    />
                                )}
                            </Box>
                        ))}

                        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
                            좋아요: {recipe.like} | 신고: {recipe.report} | 작성자: {recipe.author}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        );
    };

    export default RecipeDetail;