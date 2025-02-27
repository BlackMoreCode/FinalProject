
import {RecoilState, selector, selectorFamily} from 'recoil';
import {emailState, nicknameState, passwordState, phoneState, verifyPhone} from './AuthState';
import AuthApi from '../../api/AuthApi';

interface InputState {
  value: string;
  isValidFormat: boolean;
  isDuplicate: boolean;
  message: string;
}

export const validationSelectorFamily = selectorFamily<InputState, RecoilState<InputState>>({
  key: 'validationSelectorFamily',
  get: (state) => async ({ get }) => {
    const { value } = get(state); // get(state)로 상태 값을 가져옴

    if (!value) {
      return { value, isValidFormat: false, isDuplicate: false, message: '' };
    }

    // 유효성 검사 정규식 (이메일 / 닉네임 / 전화번호)
    const regex = (() => {
      switch (state) {
        case emailState:
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        case phoneState:
          return /^\d{10,11}$/;
        case nicknameState:
          return /^[a-zA-Z0-9가-힣]{2,16}$/;
        default:
          return null;
      }
    })();

    const baseMessage = (() => {
      switch (state) {
        case emailState:
          return '이메일';
        case phoneState:
          return '전화번호';
        default:
          return '닉네임';
      }
    })();

    if (regex === null) return { value, isValidFormat: false, isDuplicate: false, message: '코딩에러 관리자에게 문의하십시오.' }

    if (!regex.test(value)) {
      return {
        value,
        isValidFormat: false,
        isDuplicate: false,
        message: baseMessage + "의 형식이 올바르지 않습니다."
      };
    }

    try {
      const rsp =
        state === emailState
          ? await AuthApi.emailExists(value)
          : state === phoneState
            ? await AuthApi.phoneExists(value)
            : await AuthApi.nicknameExists(value);

      return rsp.data
        ? { value, isValidFormat: true, isDuplicate: false, message: `해당 ${baseMessage} 를 사용 가능합니다.` }
        : { value, isValidFormat: true, isDuplicate: true, message: `해당 ${baseMessage}는 중복된 값입니다.` };
    } catch (error) {
      console.error(error);
      return { value, isValidFormat: false, isDuplicate: false, message: '확인 중 오류 발생.' };
    }
  },
});


// 비밀번호와 비밀번호 확인 일치 여부를 체크하는 selector
export const isPasswordMatchState = selector({
  key: 'isPasswordMatchState',  // 고유한 키
  get: ({ get }) => {
    const password = get(passwordState);

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    if(passwordRegex.test(password.value)){
      return {isValidFormat: false, message: '비밀번호 형식이 올바르지 않습니다.'};
    }
    const isDuplicate = password.value === password.confirmValue

    return {isValidFormat: true, isDuplicate: isDuplicate, message: "비밀번호 형식이 올바릅니다.", confirmMessage: isDuplicate ? "비밀번호와 일치합니다." : '비밀번호와 비밀번호 확인이 일치하지 않습니다.'};
  },
});



