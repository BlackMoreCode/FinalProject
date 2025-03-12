import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from "../types";
import { logout } from './CommonAction';
import { MyInfo } from "../../api/dto/ReduxDto";

const initialState: UserState = {
  id: null,
  email: "",
  nickname: "",
  guest: false,
  admin: true,
  likedRecipes: new Set(),
  reportedRecipes: new Set(),
};

const UserReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<MyInfo>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.nickname = action.payload.nickname;
      state.guest = false;
      state.admin = action.payload.role === "ROLE_ADMIN";

      // 기존 유저의 좋아요 및 신고 리스트 업데이트 (있다면)
      if (action.payload.likedRecipes) {
        state.likedRecipes = new Set(action.payload.likedRecipes);
      }
      if (action.payload.reportedRecipes) {
        state.reportedRecipes = new Set(action.payload.reportedRecipes);
      }
    },
    setGuest: (state) => {
      state.guest = true;
      state.id = null;
      state.email = "";
      state.nickname = "";
      state.admin = false;
      state.likedRecipes.clear();
      state.reportedRecipes.clear();
    },
    toggleLikeRecipe: (state, action: PayloadAction<string>) => {
      const recipeId = action.payload;
      if (state.likedRecipes.has(recipeId)) {
        state.likedRecipes.delete(recipeId);
      } else {
        state.likedRecipes.add(recipeId);
      }
    },
    toggleReportRecipe: (state, action: PayloadAction<string>) => {
      const recipeId = action.payload;
      if (state.reportedRecipes.has(recipeId)) {
        state.reportedRecipes.delete(recipeId);
      } else {
        state.reportedRecipes.add(recipeId);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.id = null;
      state.email = "";
      state.guest = true;
      state.nickname = "";
      state.admin = false;
      state.likedRecipes.clear();
      state.reportedRecipes.clear();
    });
  },
});

export const { setUserInfo, setGuest, toggleLikeRecipe, toggleReportRecipe } = UserReducer.actions;
export default UserReducer.reducer;
