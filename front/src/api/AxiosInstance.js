"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importStar(require("axios"));
const TokenReducer_1 = require("../context/redux/TokenReducer");
const Store_1 = require("../context/Store");
// Axios 인스턴스 생성
const AxiosInstance = axios_1.default.create({
    baseURL: "",
});
// 요청 인터셉터: Access Token 자동 추가
AxiosInstance.interceptors.request.use((config) => __awaiter(void 0, void 0, void 0, function* () {
    const state = Store_1.store.getState();
    const accessToken = state.token.accessToken; // 리덕스에서 가져오기
    if (accessToken) {
        // AxiosHeaders를 사용하여 headers를 생성
        const headers = new axios_1.AxiosHeaders({
            Authorization: `Bearer ${accessToken}`,
        });
        config.headers = headers;
    }
    else {
        console.warn("🔴 Access Token 없음. 요청 취소");
        return Promise.reject(new Error("Access Token 없음"));
    }
    return config;
}), (error) => Promise.reject(error));
// 응답 인터셉터: 401 처리
AxiosInstance.interceptors.response.use((response) => response, (error) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const originalRequest = error.config;
    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 && !originalRequest._retry) {
        console.warn("🔴 401 Unauthorized 발생! 토큰 갱신 시도...");
        originalRequest._retry = true;
        try {
            const result = yield Store_1.store.dispatch((0, TokenReducer_1.handleUnauthorized)()).unwrap();
            if (!result) {
                console.warn("🔴 새 토큰 갱신 실패. 로그아웃 처리");
                Store_1.store.dispatch((0, TokenReducer_1.logout)());
                return Promise.reject(new Error("새 토큰 갱신 실패"));
            }
            // 갱신된 토큰 가져오기
            const newState = Store_1.store.getState();
            const newAccessToken = newState.token.accessToken;
            // AxiosHeaders 사용하여 새로운 헤더 설정
            const newHeaders = new axios_1.AxiosHeaders({
                Authorization: `Bearer ${newAccessToken}`,
            });
            originalRequest.headers = newHeaders;
            return AxiosInstance(originalRequest);
        }
        catch (refreshError) {
            console.error("🔴 토큰 갱신 중 오류 발생. 로그아웃 처리");
            Store_1.store.dispatch((0, TokenReducer_1.logout)());
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
}));
exports.default = AxiosInstance;
