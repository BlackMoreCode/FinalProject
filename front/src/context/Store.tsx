import { configureStore } from "@reduxjs/toolkit";
import ModalReducer from "./redux/ModalReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // 로컬 스토리지 사용
import TokenReducer from "./redux/TokenReducer"; // 토큰 리듀서 가져오기

// 퍼시스턴트 설정
const persistConfig = {
  key: "token", // 스토리지에 저장될 키
  storage, // 로컬 스토리지 사용
  whitelist: ["accessToken", "refreshToken"], // 퍼시스턴트 할 상태 항목
};

// 퍼시스턴트된 토큰 리듀서 생성
const persistedTokenReducer = persistReducer(persistConfig, TokenReducer);

// 스토어 설정
export const store = configureStore({
  reducer: {
    modal: ModalReducer, // 기존 모달 리듀서
    token: persistedTokenReducer, // 퍼시스턴트된 토큰 리듀서
  },
});

// RootState 타입을 가져올 수 있도록 export
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch 타입을 정의하여 디스패치를 사용할 때 타입 안전성 제공
export type AppDispatch = typeof store.dispatch;

const persistor = persistStore(store); // 퍼시스턴트 객체 생성

export { persistor }; // 퍼시스턴트를 외부로 내보냄
export default store;
