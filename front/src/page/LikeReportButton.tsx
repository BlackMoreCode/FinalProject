import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReportIcon from '@mui/icons-material/Report';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../context/Store';
import { toggleLikeRecipe, toggleReportRecipe } from '../context/redux/UserReducer';
import RecipeApi from '../api/RecipeApi';
import { AxiosError } from 'axios';
import { LikeReportButtonsProps } from '../api/dto/RecipeDto';


const LikeReportButtons: React.FC<LikeReportButtonsProps> = ({ postId, type, likes, reports, updateCounts }) => {
    const dispatch = useDispatch();
    const { likedRecipes, reportedRecipes } = useSelector((state: RootState) => state.user);

    const isLiked = likedRecipes.has(postId);
    const isReported = reportedRecipes.has(postId);

    // 좋아요 토글
    const toggleLike = async () => {
        const increase = !isLiked;
        try {
            const data = await RecipeApi.updateLikeCount(postId, type, increase);
            if (data) {
                updateCounts(likes + (increase ? 1 : -1), reports); // 먼저 UI 상태를 업데이트
                dispatch(toggleLikeRecipe(postId)); // 그 후 리덕스 상태 업데이트
            }
        }catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                alert('좋아요 기능은 로그인 후 사용 가능합니다.');
            } else {
                console.error("좋아요 처리 중 오류 발생:", error);
            }
        }
    };

    // 신고 토글
    const toggleReport = async () => {
        const increase = !isReported;
        try {
            const data = await RecipeApi.updateReportCount(postId, type, increase);
            if (data) {
                updateCounts(likes, reports + (increase ? 1 : -1)); // 먼저 UI 상태를 업데이트
                dispatch(toggleReportRecipe(postId)); // 그 후 리덕스 상태 업데이트
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                alert('신고 기능은 로그인 후 사용 가능합니다.');
            } else {
                console.error("신고 처리 중 오류 발생:", error);
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center', alignItems: 'center',marginTop:10 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 ,gap:5}}>
                <Typography fontSize={20} color="text.secondary" sx={{ marginRight: 3, fontWeight: 'bold' }}>
                    <strong>좋아요:</strong> {likes}
                </Typography>
                <Typography fontSize={20} color="text.secondary" sx={{ marginRight: 3, fontWeight: 'bold' }}>
                    <strong>신고:</strong> {reports}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 6 }}>
                <IconButton onClick={toggleLike} sx={{ color: isLiked ? 'red' : 'inherit', fontSize: 32 }}>
                    <FavoriteIcon sx={{ fontSize: 'inherit' }} />
                </IconButton>
                <IconButton onClick={toggleReport} sx={{ color: isReported ? 'orange' : 'inherit', fontSize: 32 }}>
                    <ReportIcon sx={{ fontSize: 'inherit' }} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default LikeReportButtons;
