"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.persistor = exports.store = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const ModalReducer_1 = __importDefault(require("./redux/ModalReducer"));
const redux_persist_1 = require("redux-persist");
const storage_1 = __importDefault(require("redux-persist/lib/storage")); // 로컬 스토리지 사용
const TokenReducer_1 = __importDefault(require("./redux/TokenReducer")); // 토큰 리듀서 가져오기
// 퍼시스턴트 설정
const persistConfig = {
    key: "token", // 스토리지에 저장될 키
    storage: // 스토리지에 저장될 키
    storage_1.default, // 로컬 스토리지 사용
    whitelist: ["accessToken", "refreshToken"], // 퍼시스턴트 할 상태 항목
};
// 퍼시스턴트된 토큰 리듀서 생성
const persistedTokenReducer = (0, redux_persist_1.persistReducer)(persistConfig, TokenReducer_1.default);
// 스토어 설정
exports.store = (0, toolkit_1.configureStore)({
    reducer: {
        modal: ModalReducer_1.default, // 기존 모달 리듀서
        token: persistedTokenReducer, // 퍼시스턴트된 토큰 리듀서
    },
});
const persistor = (0, redux_persist_1.persistStore)(exports.store); // 퍼시스턴트 객체 생성
exports.persistor = persistor;
exports.default = exports.store;
