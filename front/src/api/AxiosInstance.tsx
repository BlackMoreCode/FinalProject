import axios, { AxiosError, InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import { RootState } from "../context/Store";
import { logout, handleUnauthorized } from "../context/redux/TokenReducer";
import { store } from "../context/Store";

// Axios 인스턴스 생성
const AxiosInstance = axios.create({
  baseURL: "",
});

// 요청 인터셉터: Access Token 자동 추가
AxiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const state: RootState = store.getState();
    const accessToken = state.token.accessToken; // 리덕스에서 가져오기

    if (accessToken) {
      // AxiosHeaders를 사용하여 headers를 생성
      const headers = new AxiosHeaders({
        Authorization: `Bearer ${accessToken}`,
      });

      config.headers = headers;
    } else {
      console.warn("🔴 Access Token 없음. 요청 취소");
      return Promise.reject(new Error("Access Token 없음"));
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 응답 인터셉터: 401 처리
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn("🔴 401 Unauthorized 발생! 토큰 갱신 시도...");
      originalRequest._retry = true;

      try {
        const result = await store.dispatch(handleUnauthorized()).unwrap();

        if (!result) {
          console.warn("🔴 새 토큰 갱신 실패. 로그아웃 처리");
          store.dispatch(logout());
          return Promise.reject(new Error("새 토큰 갱신 실패"));
        }

        // 갱신된 토큰 가져오기
        const newState: RootState = store.getState();
        const newAccessToken = newState.token.accessToken;

        // AxiosHeaders 사용하여 새로운 헤더 설정
        const newHeaders = new AxiosHeaders({
          Authorization: `Bearer ${newAccessToken}`,
        });

        originalRequest.headers = newHeaders;

        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("🔴 토큰 갱신 중 오류 발생. 로그아웃 처리");
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;
