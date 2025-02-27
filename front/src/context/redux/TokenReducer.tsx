// TokenReducer.ts

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenState } from "../types";
import { RootState, store } from "../Store";
import Commons from "../../util/Common";
import axios from "axios";
import { openModal, setConfirmModal } from "./ModalReducer";
import ReduxApi from "../../api/ReduxApi";

// 초기 상태 정의
const initialState: TokenState = {
  accessToken: null,
  refreshToken: null,
  info: null,
  guest: false,
  admin: true,
};

// 리덕스 슬라이스 정의
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
      if (action.payload.refreshToken !== null) state.refreshToken = action.payload.refreshToken;
      state.accessToken = action.payload.accessToken;
      state.guest = false; // 로그인 시 guest 상태를 false로 설정
    },
    logout: (state) => {
      state.guest = true;
      state.info = null;
      state.refreshToken = null;
      state.accessToken = null;
      store.dispatch(
        setConfirmModal({
          message: "로그아웃 되었습니다.\n 다시 로그인 하시겠습니까?",
          onCancel: () => {},
          onConfirm: () => {
            store.dispatch(openModal("login"));
          }
        })
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.info = action.payload; // 유저 정보 업데이트
      state.guest = false; // 로그인 시 guest 상태를 false로 설정
      state.admin = action.payload.role === "ROLE_ADMIN";
    });
    builder.addCase(fetchUserInfo.rejected, (state) => {
      state.info = null; // 정보 가져오기 실패 시 info 초기화
      state.guest = true; // 로그인 안 된 상태로 처리
      state.admin = false;
    });
    builder.addCase(handleUnauthorized.fulfilled, (state, action) => {
      // 리프레시 토큰 처리 성공시 상태 업데이트
      if (action.payload) {
        state.guest = false;
      } else {
        store.dispatch(logout());
      }
    });
  }
});

// 리프레시 토큰 갱신 처리
export const handleUnauthorized = createAsyncThunk(
  "token/handleUnauthorized",
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const accessToken = state.token.accessToken;
    const refreshToken = state.token.refreshToken;

    if (!refreshToken) {
      return false; // 리프레시 토큰이 없으면 실패
    }

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await axios.post(
        `${Commons.BASE_URL}/auth/refresh`,
        { refreshToken },
        config
      );
      dispatch(setToken({ accessToken: response.data, refreshToken }));
      return true; // 토큰 갱신 성공
    } catch (error) {
      console.error(error);
      dispatch(logout()); // 갱신 실패시 로그아웃 처리
      return false;
    }
  }
);

// 유저 정보 가져오기
export const fetchUserInfo = createAsyncThunk(
  'token/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const rsp = await ReduxApi.getMyInfo();
      if (rsp.data === null) {
        return rejectWithValue('정보 가져오기 실패'); // 유저 정보가 없으면 실패
      }
      return rsp.data; // 성공 시 유저 정보 반환
    } catch (error) {
      return rejectWithValue('정보 가져오기 실패');
    }
  }
);

export const { setToken, logout } = TokenReducer.actions;

export default TokenReducer.reducer;
