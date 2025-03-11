import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenState } from "../types";
import { logout } from './CommonAction';
import {persistor} from "../Store";


const initialState: TokenState = {
  accessToken: null,
  refreshToken: null,
};

const TokenReducer = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string | null;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken !== null) state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      // 로그아웃 시 토큰 초기화
      state.accessToken = null;
      state.refreshToken = null;
      // 로그아웃 후 퍼시스트의 상태를 초기화 (로컬스토리지 삭제)
    });
  }
});

export const { setToken } = TokenReducer.actions;
export default TokenReducer.reducer;
