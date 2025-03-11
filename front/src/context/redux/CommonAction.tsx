import { createAction } from "@reduxjs/toolkit";
import { AppDispatch, persistor } from "../Store";

export const logout = createAction('common/logout');

export const handleLogout = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(logout()); // 로그아웃 액션 디스패치

    setTimeout(() => {
      persistor.purge(); // 스토리지 초기화 (리듀서 실행 후 실행되도록 조정)
    }, 0);
  };
};
