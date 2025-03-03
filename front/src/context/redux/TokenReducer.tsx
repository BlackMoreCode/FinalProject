import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenState } from "../types";
import { logout } from './CommonAction';

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
    });
  }
});

export const { setToken } = TokenReducer.actions;
export default TokenReducer.reducer;
