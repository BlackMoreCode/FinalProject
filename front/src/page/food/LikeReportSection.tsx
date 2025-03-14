import React from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReportIcon from '@mui/icons-material/Report';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../context/Store';
import { toggleLikeRecipe, toggleReportRecipe } from '../../context/redux/UserReducer';
import axiosInstance from '../../api/AxiosInstance';

interface LikeReportButtonsProps {
    postId: string;
    type: string;
    likes: number;
    reports: number;
    updateCounts: (newLikes: number, newReports: number) => void;
}

const LikeReportButtons: React.FC<LikeReportButtonsProps> = ({ postId, type, likes, reports, updateCounts }) => {
    const dispatch = useDispatch();
    const { likedRecipes, reportedRecipes } = useSelector((state: RootState) => state.user);

    const isLiked = likedRecipes.has(postId);
    const isReported = reportedRecipes.has(postId);

    // 좋아요 토글
    const toggleLike = async () => {
        const url = `http://localhost:8111/recipe/updateCount?action=likes&postId=${postId}&type=${type}&increase=${!isLiked}`;
        try {
            const response = await axiosInstance.post(url);
            if (response.data) {
                dispatch(toggleLikeRecipe(postId));
                updateCounts(likes + (isLiked ? -1 : 1), reports);
            }
        } catch (error) {
            console.error('좋아요 요청 실패:', error);
        }
    };

    // 신고 토글
    const toggleReport = async () => {
        const url = `http://localhost:8111/recipe/updateCount?action=reports&postId=${postId}&type=${type}&increase=${!isReported}`;
        try {
            const response = await axiosInstance.post(url);
            if (response.data) {
                dispatch(toggleReportRecipe(postId));
                updateCounts(likes, reports + (isReported ? -1 : 1));
            }
        } catch (error) {
            console.error('신고 요청 실패:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ marginRight: 2 }}>
                <strong>좋아요:</strong> {likes}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginRight: 2 }}>
                <strong>신고:</strong> {reports}
            </Typography>
            <IconButton onClick={toggleLike} sx={{ color: isLiked ? 'red' : 'inherit' }}>
                <FavoriteIcon />
            </IconButton>
            <IconButton onClick={toggleReport} sx={{ color: isReported ? 'orange' : 'inherit' }}>
                <ReportIcon />
            </IconButton>
        </Box>
    );
};

export default LikeReportButtons;
