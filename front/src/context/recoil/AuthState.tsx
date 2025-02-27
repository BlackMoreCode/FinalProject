// recoil/atoms.ts
import { atom } from 'recoil';

// 이메일 상태 및 형식 유효성, 중복 여부, 메시지를 하나의 객체로 묶어서 관리
export const emailState = atom({
  key: 'emailState', // 고유한 키
  default: {
    value: '',         // 이메일 값
    isValidFormat: false, // 이메일 형식 유효성
    isDuplicate: false,  // 이메일 중복 여부
    message: '',         // 이메일 관련 메시지
  },
});

// 닉네임 상태 및 형식 유효성, 중복 여부, 메시지를 하나의 객체로 묶어서 관리
export const nicknameState = atom({
  key: 'nicknameState', // 고유한 키
  default: {
    value: '',         // 닉네임 값
    isValidFormat: false, // 닉네임 형식 유효성
    isDuplicate: false,  // 닉네임 중복 여부
    message: '',         // 닉네임 관련 메시지
  },
});

// 비밀번호 상태
export const passwordState = atom({
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
export const phoneState = atom({
  key: 'phoneState',
  default: {
    value: '',
    isValidFormat: false,
    isDuplicate: false,
    message: '',
  }
});

export const verifyPhone = atom({
  key: 'verifyPhone',
  default: {
    verify: "",
    timer: 300,
    active: false,
  }
})

export const isChecked = atom({
  key: 'isChecked',
  default: {
    email: "",
    nickname: "",
    password: "",
    phone: "",
    verifyPhone : false,
    serviceTerm : false,
    privacyTerm : false,
  }
})