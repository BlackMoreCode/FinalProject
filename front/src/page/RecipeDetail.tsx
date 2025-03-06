import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, List, ListItem, ListItemText, Box, CircularProgress, Alert, TextField, Button } from '@mui/material';

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

// 댓글 DTO 타입 정의
interface CommentDto {
    nickName: string;
    content: string;
}

const RecipeDetail: React.FC = () => {
    const [recipe, setRecipe] = useState<FoodResDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [commentContent, setCommentContent] = useState<string>('');
    const { id, type } = useParams<{ id: string; type: string }>();

    // 레시피 정보 불러오기
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get<FoodResDto>(`/detail/${id}?type=${type}`);
                setRecipe(response.data);
                setLoading(false);
            } catch (err) {
                setError('레시피 상세 정보를 불러오는 데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id, type]);

    // 댓글 목록 불러오기
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get<CommentDto[]>(`/comments/${id}`);
                setComments(response.data);
            } catch (err) {
                setError('댓글을 불러오는 데 실패했습니다.');
            }
        };

        fetchComments();
    }, [id]);

    // 댓글 작성 함수
    const handleCommentSubmit = async () => {
        if (commentContent.trim() === '') return;

        try {
            const response = await axios.post(`/comments/${id}`, {
                content: commentContent,
            });
            if (response.data) {
                // 댓글 추가 성공 시 댓글 목록을 갱신
                setComments([...comments, { nickName: '익명', content: commentContent }]);
                setCommentContent('');
            } else {
                setError('댓글 작성에 실패했습니다.');
            }
        } catch (err) {
            setError('댓글 작성에 실패했습니다.');
        }
    };

    // 로딩, 에러 상태 처리
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

                    {/* 댓글 작성 UI */}
                    <Box sx={{ marginTop: 3 }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            댓글
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="댓글을 작성하세요"
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCommentSubmit}
                            disabled={commentContent.trim() === ''}
                        >
                            댓글 작성
                        </Button>
                    </Box>

                    {/* 댓글 목록 UI */}
                    <Box sx={{ marginTop: 3 }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            작성된 댓글
                        </Typography>
                        <List>
                            {comments.map((comment, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={`${comment.nickName}: ${comment.content}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default RecipeDetail;
