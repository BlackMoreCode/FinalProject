import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Grid, Box, CircularProgress, Alert, Divider, IconButton } from '@mui/material';
import Comment from '../Comment'; // 댓글 컴포넌트 추가
import FavoriteIcon from '@mui/icons-material/Favorite'; // 하트 아이콘
import ReportIcon from '@mui/icons-material/Report'; // 사이렌 아이콘

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
    cookingMethod: string;
    category: string;
    description: string;
    ingredients: IngredientDto[];
    instructions: ManualDto[];
    image: string;
    like: number;
    report: number;
    author: number;
}

const RecipeDetail: React.FC = () => {
    const [recipe, setRecipe] = useState<FoodResDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [liked, setLiked] = useState<boolean>(false);  // 좋아요 상태
    const [reported, setReported] = useState<boolean>(false);  // 신고 상태
    const { id, type } = useParams<{ id: string; type: string }>();

    // 레시피 정보 불러오기
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get<FoodResDto>(`http://localhost:8111/test/detail/${id}?type=${type}`);
                setRecipe(response.data);
                setLoading(false);
            } catch (err) {
                setError('레시피 상세 정보를 불러오는 데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id, type]);

    // 좋아요 토글
    const toggleLike = async () => {
        // UI에서 바로 반영
        setLiked(prev => !prev);
        setRecipe(prev => prev ? { ...prev, like: prev ? prev.like + (liked ? -1 : 1) : 0 } : prev);

        const url = `http://localhost:8111/api/recipe/updateCount?action=likes&postId=${id}&type=${type}&increase=${!liked}`;
        try {
            // 서버 요청 후 상태 다시 체크
            const response = await axios.post(url);
            if (!response.data) {
                // 서버에서 에러가 발생하면 UI 상태를 원래대로 돌려놓음
                setLiked(liked);
                setRecipe(prev => prev ? { ...prev, like: prev ? prev.like - (liked ? 1 : -1) : 0 } : prev);
            }
        } catch (error) {
            console.error("좋아요 요청 실패:", error);
            // 요청 실패 시 UI 상태 복원
            setLiked(liked);
            setRecipe(prev => prev ? { ...prev, like: prev ? prev.like - (liked ? 1 : -1) : 0 } : prev);
        }
    };
    
    // 신고 토글
    const toggleReport = async () => {
        // UI에서 바로 반영
        setReported(prev => !prev);
        setRecipe(prev => prev ? { ...prev, report: prev ? prev.report + (reported ? -1 : 1) : 0 } : prev);

        const url = `http://localhost:8111/recipe/updateCount?action=reports&postId=${id}&type=${type}&increase=${!reported}`;
        try {
            // 서버 요청 후 상태 다시 체크
            const response = await axios.post(url);
            if (!response.data) {
                // 서버에서 에러가 발생하면 UI 상태를 원래대로 돌려놓음
                setReported(reported);
                setRecipe(prev => prev ? { ...prev, report: prev ? prev.report - (reported ? 1 : -1) : 0 } : prev);
            }
        } catch (error) {
            console.error("신고 요청 실패:", error);
            // 요청 실패 시 UI 상태 복원
            setReported(reported);
            setRecipe(prev => prev ? { ...prev, report: prev ? prev.report - (reported ? 1 : -1) : 0 } : prev);
        }
    };
    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!recipe) return <Alert severity="warning">레시피를 찾을 수 없습니다.</Alert>;

    return (
        <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 3 }}>
            <Card>
                <CardMedia
                    component="img"
                    image={recipe.image}
                    alt={recipe.name}
                    sx={{ borderRadius: 2, height: 800, width: '100%', objectFit: 'cover' }}
                />
                <CardContent>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 3 }}>
                        {recipe.name}
                    </Typography>
                    <Grid container spacing={2} sx={{ marginBottom: 3 }}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" color="text.secondary">
                                <strong>조리 방법:</strong> {recipe.cookingMethod}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1" color="text.secondary">
                                <strong>요리 종류:</strong> {recipe.category}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" color="text.secondary">
                                <strong>팁:</strong> {recipe.description}
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* 재료 */}
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', marginTop: 3 }}>
                        재료
                    </Typography>
                    <Divider sx={{ marginBottom: 2 }} />
                    <Grid container spacing={2}>
                        {recipe.ingredients?.map((ingredient, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Typography variant="body1">
                                    {`${ingredient.ingredient}: ${ingredient.amount}`}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>

                    {/* 조리 과정 */}
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', marginTop: 4 }}>
                        조리 과정
                    </Typography>
                    <Divider sx={{ marginBottom: 2 }} />
                    {recipe.instructions?.map((manual, index) => (
                        <Box key={index} sx={{ marginBottom: 4 }}>
                            {manual.imageUrl && (
                                <CardMedia
                                    component="img"
                                    height="100"
                                    image={manual.imageUrl}
                                    alt={`조리 과정 ${index + 1}`}
                                    sx={{ borderRadius: 2, marginTop: 2 }}
                                />
                            )}
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                {`${index + 1}. ${manual.text}`}
                            </Typography>
                        </Box>
                    ))}

                    {/* 좋아요, 신고, 작성자 정보 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ marginRight: 2 }}>
                            <strong>좋아요:</strong> {recipe.like}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ marginRight: 2 }}>
                            <strong>신고:</strong> {recipe.report}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <strong>작성자:</strong> {recipe.author}
                        </Typography>
                    </Box>

                    {/* 좋아요 및 신고 버튼 */}
                    <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                        <IconButton onClick={toggleLike} sx={{ color: liked ? 'red' : 'inherit' }}>
                            <FavoriteIcon /> {/* 하트 아이콘 */}
                        </IconButton>
                        <IconButton onClick={toggleReport} sx={{ color: reported ? 'orange' : 'inherit' }}>
                            <ReportIcon /> {/* 사이렌 아이콘 */}
                        </IconButton>
                    </Box>

                    {/* 댓글 섹션 */}
                    <Comment postId={id ?? ''} />
                </CardContent>
            </Card>
        </Box>
    );
};

export default RecipeDetail;