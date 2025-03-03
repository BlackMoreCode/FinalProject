import React from "react";
import {MyInfo} from "../api/dto/ReduxDto";

// 토큰에 들어가는 데이터 타입
export interface TokenState{
  accessToken: string | null,
  refreshToken: string | null,
}
export interface UserState{
  id: number | null,
  email: string,
  nickname: string,
  guest: boolean,
  admin: boolean,
}
// 모달에 들어가는 데이터 타입
export interface ModalState {
  loginModal: boolean;
  signupModal: boolean;
  findIdModal: boolean;
  findPwModal: boolean;
  loadingModal: {
    open: boolean;
    message: string;
  } | null;
  rejectModal: {
    open: boolean;
    message: string;
    onCancel: (() => void) | null;
  };
  confirmModal: {
    open: boolean;
    message: string;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
  };
  optionModal: {
    open: boolean;
    message: string;
    options: Option[];
    onOption: ((value: string) => void) | null;
    onCancel: (() => void) | null;
  };
  submitModal: {
    open: boolean;
    message: string;
    initial: {
      content: string;
      id: string;
    };
    restriction?: string;
    onSubmit: ((data: { content: string; id: string }) => void) | null;
    onCancel: (() => void) | null;
  };
  cursorModal: {
    open: boolean;
    message: string;
    options: Option[];
    onOption: ((value: string | number, id: string | number) => void) | null;
    onCancel: (() => void) | null;
    position: Position | null;
    id: string | number;
  };
  titleNContentModal: {
    open: boolean;
    title: string;
    content: string;
    onCancel: (() => void) | null;
  };
}


// 옵션 모달에 들어가는 옵션객체의 데이터 타입
export interface Option {
  label: string;
  type: "contained" | "outlined" | "create";
  value: string;
}

// 커서 모달에 들어가는 포지션 객체의 데이터 타입
export interface Position {
  x: number;
  y: number;
}
export type SNSLoginType = "google" | "naver" | "kakao";
// 변화 감지용 함수 타입 (함수에 지정하면, 알아서 타입이 지정됨)
export type Change = React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
// 클릭 감지용 함수 타입
export type Click = React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
// 키 입력 감지용 함수 타입
export type KeyPress = React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
// 변화 감지와 세터도 설정할 수 있게 만든 객체 타입
export type ChangeWithSetter<T> = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setter: React.Dispatch<React.SetStateAction<T>>
) => void;


// 인풋 요소의 공통적인 타입
export interface InputProps {
  value: string;
  onChange: Change; // input, textarea 등에서 사용할 onChange 이벤트
}