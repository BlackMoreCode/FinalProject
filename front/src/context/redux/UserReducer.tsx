import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from "../types";
import { logout } from './CommonAction';
import {MyInfo} from "../../api/dto/ReduxDto";

const initialState: UserState = {
  id: null,
  email : "",
  nickname : "",
  guest: false,
  admin: true,
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
    },
    setGuest: (state) => {
      state.guest = true;
      state.id = null;
      state.email = "";
      state.nickname = "";
      state.admin = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      // 로그아웃 시 유저 정보 초기화
      state.id = null;
      state.email = "";
      state.guest = true;
      state.nickname = "";
      state.admin = false;
    });
  },
});

export const { setUserInfo, setGuest } = UserReducer.actions;
export default UserReducer.reducer;
