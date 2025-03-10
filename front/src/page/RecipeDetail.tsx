import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, List, ListItem, ListItemText, Box, CircularProgress, Alert, TextField, Button, Grid, Divider } from '@mui/material';

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
    cookingMethod: string; // 조리 방법
    category: string; // 요리 종류
    description: string; // 팁
    ingredients: IngredientDto[];
    instructions: ManualDto[]; // 조리 과정
    image: string; // 메인 이미지
    like: number;
    report: number;
    author: number;
}

// 댓글 DTO 타입 정의
interface CommentDto {
    commentId: number;
    nickName: string;
    content: string;
    parentCommentId: number | null; // 대댓글을 구분하기 위한 부모 댓글 ID
    replies: CommentDto[]; // 대댓글 리스트
}

const RecipeDetail: React.FC = () => {
    const [recipe, setRecipe] = useState<FoodResDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [comments, setComments] = useState<CommentDto[]>([]); // 댓글 목록
    const [commentContent, setCommentContent] = useState<string>(''); // 댓글 내용
    const { id, type } = useParams<{ id: string; type: string }>();

    // 대댓글이 열려 있는 댓글 ID 목록
    const [expandedCommentIds, setExpandedCommentIds] = useState<number[]>([]);

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

    // 댓글 목록 불러오기
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get<CommentDto[]>(`http://localhost:8111/comments/${id}`);
                setComments(response.data ?? []);
            } catch (err) {
                setComments([]);
                setError('댓글을 불러오는 데 실패했습니다.');
            }
        };

        fetchComments();
    }, [id]);

    // 댓글 작성 함수
    const handleCommentSubmit = async () => {
        if (commentContent.trim() === '') return;

        try {
            const response = await axios.post(`http://localhost:8111/comments/${id}`, {
                content: commentContent,
            });
            if (response.data) {
                setComments([...comments, { commentId: Date.now(), nickName: '익명', content: commentContent, parentCommentId: null, replies: [] }]);
                setCommentContent('');
            } else {
                setError('댓글 작성에 실패했습니다.');
            }
        } catch (err) {
            setError('댓글 작성에 실패했습니다.');
        }
    };

    // 대댓글 작성 함수
    const handleReplySubmit = async (parentCommentId: number, replyContent: string) => {
        if (replyContent.trim() === '') return;

        try {
            const response = await axios.post(`http://localhost:8111/comments/reply/${parentCommentId}`, {
                content: replyContent,
            });
            if (response.data) {
                setComments(comments.map(comment =>
                    comment.commentId === parentCommentId
                        ? { ...comment, replies: [...comment.replies, { commentId: Date.now(), nickName: '익명', content: replyContent, parentCommentId, replies: [] }] }
                        : comment
                ));
            } else {
                setError('대댓글 작성에 실패했습니다.');
            }
        } catch (err) {
            setError('대댓글 작성에 실패했습니다.');
        }
    };

    // 대댓글 열고 닫기 토글
    const toggleReplies = (commentId: number) => {
        setExpandedCommentIds(prev => {
            // 클릭한 댓글 ID가 이미 열려 있다면 닫기
            if (prev.includes(commentId)) {
                return prev.filter(id => id !== commentId);
            }
            // 클릭한 댓글 ID만 열기
            return [...prev, commentId];
        });
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!recipe) return <Alert severity="warning">레시피를 찾을 수 없습니다.</Alert>;

    return (
        <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 3 }}>
            <Card>
                {/* 메인 이미지 */}
                <CardMedia
                    component="img"
                    image={recipe.image}
                    alt={recipe.name}
                    sx={{
                        borderRadius: 2,
                        height: 800,
                        width: '100%',
                        objectFit: 'cover',
                    }}
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
                    <Typography variant="body2" color="text.secondary" sx={{ marginTop: 3 }}>
                        <strong>좋아요:</strong> {recipe.like} | <strong>신고:</strong> {recipe.report} | <strong>작성자:</strong> {recipe.author}
                    </Typography>

                    {/* 댓글 목록 UI */}
                    <Box sx={{ marginTop: 3 }}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                            댓글
                        </Typography>
                    
                        <List>
                            {comments.map((comment) => (
                                <CommentItem
                                    key={comment.commentId}
                                    comment={comment}
                                    onReplySubmit={handleReplySubmit}
                                    toggleReplies={toggleReplies}
                                    expanded={expandedCommentIds.includes(comment.commentId)}
                                />
                            ))}
                        </List>
                    </Box>

                    <Box sx={{ marginTop: 4 }}>
                        <Divider sx={{ marginBottom: 2 }} />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="댓글을 작성하세요"
                            sx={{ marginBottom: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCommentSubmit}
                            disabled={commentContent.trim() === ''}
                            sx={{ marginBottom: 3 }}
                        >
                            댓글 작성
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

// 댓글 아이템 컴포넌트
const CommentItem: React.FC<{
    comment: CommentDto;
    onReplySubmit: (parentCommentId: number, replyContent: string) => void;
    toggleReplies: (commentId: number) => void;
    expanded: boolean;
}> = ({ comment, onReplySubmit, toggleReplies, expanded }) => {
    const [replyContent, setReplyContent] = useState<string>('');

    return (
        <Box sx={{ marginBottom: 2, paddingLeft: 2 }}>
            <Divider sx={{ marginBottom: 2 }} />
            <ListItem sx={{ paddingLeft: 0 }}>
                <ListItemText
                    primary={`${comment.nickName}: ${comment.content}`}
                    sx={{ paddingLeft: 2 }}
                />
                <Button
                    size="small"
                    onClick={() => toggleReplies(comment.commentId)} // 특정 댓글의 대댓글만 열도록 변경
                >
                    {expanded ? '답글 숨기기' : '답글'}
                </Button>
            </ListItem>

            {/* 대댓글 목록 */}
            {expanded && comment.replies.length > 0 && (
                <Box sx={{ paddingLeft: 4 }}>
                    <Divider sx={{ marginBottom: 2 }} />
                    <List sx={{ paddingLeft: 4 }}>
                        {comment.replies.map((reply) => (
                            <ListItem key={reply.commentId} sx={{ paddingLeft: 4, borderBottom: '1px solid #ddd' }}>
                                <ListItemText
                                    primary={`- ${reply.nickName}: ${reply.content}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* 대댓글 작성 폼 */}
            {expanded && (
                <Box sx={{ marginTop: 2, paddingLeft: 4 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="대댓글을 작성하세요"
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            onReplySubmit(comment.commentId, replyContent);
                            setReplyContent('');
                        }}
                        disabled={replyContent.trim() === ''}
                    >
                        대댓글 작성
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default RecipeDetail;
