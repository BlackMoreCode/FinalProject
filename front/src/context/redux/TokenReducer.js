"use strict";
// TokenReducer.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.setToken = exports.fetchUserInfo = exports.handleUnauthorized = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const Store_1 = require("../Store");
const Common_1 = __importDefault(require("../../util/Common"));
const axios_1 = __importDefault(require("axios"));
const ModalReducer_1 = require("./ModalReducer");
const ReduxApi_1 = __importDefault(require("../../api/ReduxApi"));
// 초기 상태 정의
const initialState = {
    accessToken: null,
    refreshToken: null,
    info: null,
    guest: false,
    admin: true,
};
// 리덕스 슬라이스 정의
const TokenReducer = (0, toolkit_1.createSlice)({
    name: "token",
    initialState,
    reducers: {
        setToken: (state, action) => {
            if (action.payload.refreshToken !== null)
                state.refreshToken = action.payload.refreshToken;
            state.accessToken = action.payload.accessToken;
            state.guest = false; // 로그인 시 guest 상태를 false로 설정
        },
        logout: (state) => {
            state.guest = true;
            state.info = null;
            state.refreshToken = null;
            state.accessToken = null;
            Store_1.store.dispatch((0, ModalReducer_1.setConfirmModal)({
                message: "로그아웃 되었습니다.\n 다시 로그인 하시겠습니까?",
                onCancel: () => { },
                onConfirm: () => {
                    Store_1.store.dispatch((0, ModalReducer_1.openModal)("login"));
                }
            }));
        },
    },
    extraReducers: (builder) => {
        builder.addCase(exports.fetchUserInfo.fulfilled, (state, action) => {
            state.info = action.payload; // 유저 정보 업데이트
            state.guest = false; // 로그인 시 guest 상태를 false로 설정
            state.admin = action.payload.role === "ROLE_ADMIN";
        });
        builder.addCase(exports.fetchUserInfo.rejected, (state) => {
            state.info = null; // 정보 가져오기 실패 시 info 초기화
            state.guest = true; // 로그인 안 된 상태로 처리
            state.admin = false;
        });
        builder.addCase(exports.handleUnauthorized.fulfilled, (state, action) => {
            // 리프레시 토큰 처리 성공시 상태 업데이트
            if (action.payload) {
                state.guest = false;
            }
            else {
                Store_1.store.dispatch((0, exports.logout)());
            }
        });
    }
});
// 리프레시 토큰 갱신 처리
exports.handleUnauthorized = (0, toolkit_1.createAsyncThunk)("token/handleUnauthorized", (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { dispatch, getState }) {
    const state = getState();
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
        const response = yield axios_1.default.post(`${Common_1.default.BASE_URL}/auth/refresh`, { refreshToken }, config);
        dispatch((0, exports.setToken)({ accessToken: response.data, refreshToken }));
        return true; // 토큰 갱신 성공
    }
    catch (error) {
        console.error(error);
        dispatch((0, exports.logout)()); // 갱신 실패시 로그아웃 처리
        return false;
    }
}));
// 유저 정보 가져오기
exports.fetchUserInfo = (0, toolkit_1.createAsyncThunk)('token/fetchUserInfo', (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { rejectWithValue }) {
    try {
        const rsp = yield ReduxApi_1.default.getMyInfo();
        if (rsp.data === null) {
            return rejectWithValue('정보 가져오기 실패'); // 유저 정보가 없으면 실패
        }
        return rsp.data; // 성공 시 유저 정보 반환
    }
    catch (error) {
        return rejectWithValue('정보 가져오기 실패');
    }
}));
_a = TokenReducer.actions, exports.setToken = _a.setToken, exports.logout = _a.logout;
exports.default = TokenReducer.reducer;
