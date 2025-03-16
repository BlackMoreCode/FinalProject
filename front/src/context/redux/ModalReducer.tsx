import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {ModalState, Option, Position} from "../types";
import {logout} from "./CommonAction";

// 초기 상태 설정
const initialState: ModalState = {
  loginModal: false,
  signupModal: false,
  findIdModal: false,
  findPwModal: false,
  calendarModal: {
    open: false,
    message: "",
    date: "",
    memberId: null,
  },
  loadingModal: null,
  rejectModal: {
    open: false,
    message: "",
    onCancel: null,
  },
  confirmModal: {
    open: false,
    message: "",
    onConfirm: null,
    onCancel: null,
  },
  optionModal: {
    open: false,
    message: "",
    options: [],
    onOption: null,
    onCancel: null,
  },
  submitModal: {
    open: false,
    message: "",
    initial: {
      content: "",
      id: "",
    },
    restriction: undefined,
    onSubmit: null,
    onCancel: null,
  },
  cursorModal: {
    open: false,
    message: "",
    options: [],
    onOption: null,
    onCancel: null,
    position: null,
    id: "",
  },
  titleNContentModal: {
    open: false,
    title: "",
    content: "",
    onCancel: null,
  }
};

const ModalReducer = createSlice({
  name: "modal",
  initialState,
  reducers: {
    // 로그인과 회원가입 모달을 토글하는 액션
    openModal: (
      state,
      action: PayloadAction< "login" | "signup" | "findId" | "findPw">
    ) => {
      switch (action.payload) {
        case "login":
          state.loginModal = true;
          break;
        case "signup":
          state.signupModal = true;
          break;
        case "findId":
          state.findIdModal = true;
          break;
        case "findPw":
          state.findPwModal = true;
          break;
        default:
          break;
      }
    },
    setCalendarModal: (
      state,
      action: PayloadAction<{
      message: string;
      date: string;
      memberId: number;
    }>) => {
      state.calendarModal = {...action.payload, open: true};
    },

    openLoadingModal: (
      state,
      action: PayloadAction<{
        message: string;
      }>
    ) => {
      state.loadingModal = { ...action.payload, open: true };
    },

    // rejectModal의 값 설정
    setRejectModal: (
      state,
      action: PayloadAction<{
        message: string;
        onCancel: (() => void) | null
      }>
    ) => {
      state.rejectModal = { ...action.payload, open: true };
    },

    // confirmModal의 값 설정
    setConfirmModal: (
      state,
      action: PayloadAction<{
        message: string;
        onConfirm: (() => void) | null
        onCancel: (() => void) | null
      }>
    ) => {
      state.confirmModal = { ...action.payload, open: true };
    },

    // optionModal의 값 설정
    setOptionModal: (
      state,
      action: PayloadAction<{
        message: string;
        options: Option[];
        onOption: ((value: string) => void ) | null;
        onCancel: (() => void) | null
      }>
    ) => {
      state.optionModal = { ...action.payload, open: true };
    },

    // submitModal의 값 설정
    setSubmitModal: (
      state,
      action: PayloadAction<{
        message: string;
        initial: { content: string; id: string };
        restriction?: string;
        onSubmit: ((data: { content: string; id: string }) => void) | null;
        onCancel: (() => void) | null
      }>
    ) => {
      state.submitModal = { ...action.payload, open: true };
    },

    // cursorModal의 값 설정
    setCursorModal: (
      state,
      action: PayloadAction<{
        message: string;
        options: Option[];
        onOption: ((value: string | number, id: string | number) => void) | null;
        onCancel: (() => void) | null
        position: Position | null;
        id: string | number;
      }>
    ) => {
      state.cursorModal = { ...action.payload, open: true };
    },
    setTitleNContentModal: (
      state,
      action: PayloadAction<{title: string, content: string, onCancel: (() => void) | null}>
    ) => {
      state.titleNContentModal = {...action.payload, open : true };
    },
    // 각각의 모달을 개별적으로 초기화하는 액션
    closeModal: (
      state,
      action: PayloadAction< "login" | "signup" | "findId" | "findPw" >
    ) => {
      switch (action.payload) {
        case "login":
          state.loginModal = false;
          break;
        case "signup":
          state.signupModal = false;
          break;
        case "findId":
          state.findIdModal = false;
          break;
        case "findPw":
          state.findPwModal = false;
          break;
        default:
          break;
      }
    },
    closeCalendarModal: (state) => {
      state.calendarModal = {open: false, message: "", memberId: null, date: ""};
    },
    closeLoadingModal: (state) => {
      state.loadingModal = null;
    },
    closeRejectModal: (state) => {
      state.rejectModal = { open: false, message: "", onCancel: null };
    },
    closeConfirmModal: (state) => {
      state.confirmModal = { open: false, message: "", onConfirm: null, onCancel: null };
    },
    closeOptionModal: (state) => {
      state.optionModal = { open: false, message: "", options: [], onOption: (value: string) => {}, onCancel: null };
    },
    closeSubmitModal: (state) => {
      state.submitModal = { open: false, message: "", initial: { content: "", id: "" }, restriction: undefined, onSubmit: null, onCancel: null };
    },
    closeCursorModal: (state) => {
      state.cursorModal = { open: false, message: "", options: [], onOption: null, onCancel: null, position: null, id: "" };
    },
    closeTitleNContentModal: (state) => {
      state.titleNContentModal = {open: false, title: "", content: "", onCancel: null };
    },

    // 모든 모달을 초기화하는 액션
    closeAll: (state) => {
      state.loginModal = false;
      state.signupModal = false;
      state.findPwModal = false;
      state.findIdModal = false;
      state.calendarModal = {open: false, message: "", memberId: null, date: ""};
      state.loadingModal = null;
      state.rejectModal = { open: false, message: "", onCancel: null };
      state.confirmModal = { open: false, message: "", onConfirm: null, onCancel: null };
      state.optionModal = { open: false, message: "", options: [], onOption: null, onCancel: null };
      state.submitModal = { open: false, message: "", initial: { content: "", id: "" }, restriction: undefined, onSubmit: (data: { content: string; id: string }) => {}, onCancel: null };
      state.cursorModal = { open: false, message: "", options: [], onOption: null, onCancel: null, position: null, id: "" };
      state.titleNContentModal = {open : false, title: "", content: "", onCancel: null };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      // 로그아웃 시 유저 정보 초기화
      state.confirmModal = {open: true, message: "로그아웃 되었습니다. \n 다시 로그인 하시겠습니까?", onConfirm: null, onCancel: null};
    });
  },
});

export const {
  openModal,
  setCalendarModal,
  openLoadingModal,
  setRejectModal,
  setConfirmModal,
  setOptionModal,
  setSubmitModal,
  setCursorModal,
  setTitleNContentModal,
  closeLoadingModal,
  closeModal,
  closeCalendarModal,
  closeRejectModal,
  closeConfirmModal,
  closeOptionModal,
  closeSubmitModal,
  closeCursorModal,
  closeTitleNContentModal,
  closeAll,
} = ModalReducer.actions;

export default ModalReducer.reducer;

