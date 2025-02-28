"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPasswordMatchState = exports.validationSelectorFamily = void 0;
const recoil_1 = require("recoil");
const AuthState_1 = require("./AuthState");
const AuthApi_1 = __importDefault(require("../../api/AuthApi"));
exports.validationSelectorFamily = (0, recoil_1.selectorFamily)({
    key: 'validationSelectorFamily',
    get: (state) => (_a) => __awaiter(void 0, [_a], void 0, function* ({ get }) {
        const { value } = get(state); // get(state)로 상태 값을 가져옴
        if (!value) {
            return { value, isValidFormat: false, isDuplicate: false, message: '' };
        }
        // 유효성 검사 정규식 (이메일 / 닉네임 / 전화번호)
        const regex = (() => {
            switch (state) {
                case AuthState_1.emailState:
                    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                case AuthState_1.phoneState:
                    return /^\d{10,11}$/;
                case AuthState_1.nicknameState:
                    return /^[a-zA-Z0-9가-힣]{2,16}$/;
                default:
                    return null;
            }
        })();
        const baseMessage = (() => {
            switch (state) {
                case AuthState_1.emailState:
                    return '이메일';
                case AuthState_1.phoneState:
                    return '전화번호';
                default:
                    return '닉네임';
            }
        })();
        if (regex === null)
            return { value, isValidFormat: false, isDuplicate: false, message: '코딩에러 관리자에게 문의하십시오.' };
        if (!regex.test(value)) {
            return {
                value,
                isValidFormat: false,
                isDuplicate: false,
                message: baseMessage + "의 형식이 올바르지 않습니다."
            };
        }
        try {
            const rsp = state === AuthState_1.emailState
                ? yield AuthApi_1.default.emailExists(value)
                : state === AuthState_1.phoneState
                    ? yield AuthApi_1.default.phoneExists(value)
                    : yield AuthApi_1.default.nicknameExists(value);
            return rsp.data
                ? { value, isValidFormat: true, isDuplicate: false, message: `해당 ${baseMessage} 를 사용 가능합니다.` }
                : { value, isValidFormat: true, isDuplicate: true, message: `해당 ${baseMessage}는 중복된 값입니다.` };
        }
        catch (error) {
            console.error(error);
            return { value, isValidFormat: false, isDuplicate: false, message: '확인 중 오류 발생.' };
        }
    }),
});
// 비밀번호와 비밀번호 확인 일치 여부를 체크하는 selector
exports.isPasswordMatchState = (0, recoil_1.selector)({
    key: 'isPasswordMatchState', // 고유한 키
    get: ({ get }) => {
        const password = get(AuthState_1.passwordState);
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
        if (passwordRegex.test(password.value)) {
            return { isValidFormat: false, message: '비밀번호 형식이 올바르지 않습니다.' };
        }
        const isDuplicate = password.value === password.confirmValue;
        return { isValidFormat: true, isDuplicate: isDuplicate, message: "비밀번호 형식이 올바릅니다.", confirmMessage: isDuplicate ? "비밀번호와 일치합니다." : '비밀번호와 비밀번호 확인이 일치하지 않습니다.' };
    },
});
