"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChecked = exports.verifyPhone = exports.phoneState = exports.passwordState = exports.nicknameState = exports.emailState = void 0;
// recoil/atoms.ts
const recoil_1 = require("recoil");
// 이메일 상태 및 형식 유효성, 중복 여부, 메시지를 하나의 객체로 묶어서 관리
exports.emailState = (0, recoil_1.atom)({
    key: 'emailState', // 고유한 키
    default: {
        value: '', // 이메일 값
        isValidFormat: false, // 이메일 형식 유효성
        isDuplicate: false, // 이메일 중복 여부
        message: '', // 이메일 관련 메시지
    },
});
// 닉네임 상태 및 형식 유효성, 중복 여부, 메시지를 하나의 객체로 묶어서 관리
exports.nicknameState = (0, recoil_1.atom)({
    key: 'nicknameState', // 고유한 키
    default: {
        value: '', // 닉네임 값
        isValidFormat: false, // 닉네임 형식 유효성
        isDuplicate: false, // 닉네임 중복 여부
        message: '', // 닉네임 관련 메시지
    },
});
// 비밀번호 상태
exports.passwordState = (0, recoil_1.atom)({
    key: 'passwordState',
    default: {
        value: '',
        confirmValue: '',
        isValidFormat: false,
        isDuplicate: false,
        message: '',
        confirmMessage: '',
    },
});
// 전화번호 상태
exports.phoneState = (0, recoil_1.atom)({
    key: 'phoneState',
    default: {
        value: '',
        isValidFormat: false,
        isDuplicate: false,
        message: '',
    }
});
exports.verifyPhone = (0, recoil_1.atom)({
    key: 'verifyPhone',
    default: {
        verify: "",
        timer: 300,
        active: false,
    }
});
exports.isChecked = (0, recoil_1.atom)({
    key: 'isChecked',
    default: {
        email: "",
        nickname: "",
        password: "",
        phone: "",
        verifyPhone: false,
        serviceTerm: false,
        privacyTerm: false,
    }
});
