import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, List, ListItem, ListItemText, Divider, TextField, Button, Typography } from '@mui/material';

// 댓글 DTO 타입 정의
interface CommentDto {
    commentId: number;
    nickName: string;
    content: string;
    parentCommentId: number | null;
    replies: CommentDto[];
}

interface CommentSectionProps {
    postId: string; // 댓글이 속한 게시물 ID
}

const Comment: React.FC<CommentSectionProps> = ({ postId }) => {
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [commentContent, setCommentContent] = useState<string>('');
    const [expandedCommentIds, setExpandedCommentIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get<CommentDto[]>(`http://localhost:8111/comments/${postId}`);
                setComments(response.data ?? []);
            } catch (err) {
                console.error('댓글을 불러오는 데 실패했습니다.', err);
                setComments([]);
            }
        };

        fetchComments();
    }, [postId]);

    const handleCommentSubmit = async () => {
        if (commentContent.trim() === '') return;

        try {
            const response = await axios.post(`http://localhost:8111/comments/${postId}`, { content: commentContent });
            if (response.data) {
                setComments([...comments, { commentId: Date.now(), nickName: '익명', content: commentContent, parentCommentId: null, replies: [] }]);
                setCommentContent('');
            }
        } catch (err) {
            console.error('댓글 작성에 실패했습니다.', err);
        }
    };

    const handleReplySubmit = async (parentCommentId: number, replyContent: string) => {
        if (replyContent.trim() === '') return;

        try {
            const response = await axios.post(`http://localhost:8111/comments/reply/${parentCommentId}`, { content: replyContent });
            if (response.data) {
                setComments(comments.map(comment =>
                    comment.commentId === parentCommentId
                        ? { ...comment, replies: [...comment.replies, { commentId: Date.now(), nickName: '익명', content: replyContent, parentCommentId, replies: [] }] }
                        : comment
                ));
            }
        } catch (err) {
            console.error('대댓글 작성에 실패했습니다.', err);
        }
    };

    const toggleReplies = (commentId: number) => {
        setExpandedCommentIds(prev => prev.includes(commentId) ? prev.filter(id => id !== commentId) : [...prev, commentId]);
    };

    return (
        <Box sx={{ marginTop: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>댓글</Typography>
            <List>
                {comments.map(comment => (
                    <CommentItem
                        key={comment.commentId}
                        comment={comment}
                        onReplySubmit={handleReplySubmit}
                        toggleReplies={toggleReplies}
                        expanded={expandedCommentIds.includes(comment.commentId)}
                    />
                ))}
            </List>
            <Box sx={{ marginTop: 2 }}>
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
                >
                    댓글 작성
                </Button>
            </Box>
        </Box>
    );
};

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
                <ListItemText primary={`${comment.nickName}: ${comment.content}`} sx={{ paddingLeft: 2 }} />
                <Button size="small" onClick={() => toggleReplies(comment.commentId)}>
                    {expanded ? '답글 숨기기' : '답글'}
                </Button>
            </ListItem>
            {expanded && comment.replies.length > 0 && (
                <Box sx={{ paddingLeft: 4 }}>
                    <Divider sx={{ marginBottom: 2 }} />
                    <List sx={{ paddingLeft: 4 }}>
                        {comment.replies.map(reply => (
                            <ListItem key={reply.commentId} sx={{ paddingLeft: 4, borderBottom: '1px solid #ddd' }}>
                                <ListItemText primary={`- ${reply.nickName}: ${reply.content}`} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
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

export default Comment;
