// src/api/axiosInstance.ts
import axios from 'axios';

import ReduxApi from "./ReduxApi";
import store from '../context/Store';
import {setToken } from '../context/redux/TokenReducer';
import {handleLogout} from "../context/redux/CommonAction";

// axios 인스턴스를 생성합니다.
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8111',  // 서버 URL
});

// 요청 인터셉터 설정: 요청 전 설정할 부분
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.token.accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // 토큰을 헤더에 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정: 401 오류가 발생했을 때 토큰 갱신
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // 401 Unauthorized 에러가 발생하면 토큰 갱신 시도
      try {
        const refreshToken = store.getState().token.refreshToken;
        if (refreshToken) {
          // refreshToken을 사용하여 토큰 갱신
          const rsp = await ReduxApi.refresh(refreshToken);
          store.dispatch(setToken({ accessToken: rsp.data, refreshToken : null }));

          // 토큰 갱신 후 다시 요청을 보냄
          error.config.headers['Authorization'] = `Bearer ${rsp.data}`;
          return axiosInstance(error.config); // 재요청
        }
      } catch (e) {
        console.error('토큰 갱신 실패:', e);
        store.dispatch(handleLogout()); // 갱신 실패 시 로그아웃 처리
        return Promise.reject(error); // 에러 반환
      }
    }
    return Promise.reject(error); // 401이 아닌 경우 그대로 에러 반환
  }
);

export default axiosInstance;
