import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {ModalState, Option, Position} from "../types";
import {RootState} from "../Store";

// 초기 상태 설정
const initialState: ModalState = {
  loginModal: false,
  signupModal: false,
  findIdModal: false,
  findPwModal: false,
  loadingModal: null,
  rejectModal: {
    open: false,
    message: "",
    onCancel: () => {},
  },
  confirmModal: {
    open: false,
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  },
  optionModal: {
    open: false,
    message: "",
    options: [],
    onOption: (value: string) => {},
    onCancel: () => {},
  },
  submitModal: {
    open: false,
    message: "",
    initial: {
      content: "",
      id: "",
    },
    restriction: undefined,
    onSubmit: (data: { content: string; id: string }) => {},
    onCancel: () => {},
  },
  cursorModal: {
    open: false,
    message: "",
    options: [],
    onOption: (value: string | number, id: string | number) => {},
    onCancel: () => {},
    position: null,
    id: "",
  },
  titleNContentModal: {
    open: false,
    title: "",
    content: "",
    onCancel: () => {},
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
        onCancel: () => void;
      }>
    ) => {
      state.rejectModal = { ...action.payload, open: true };
    },

    // confirmModal의 값 설정
    setConfirmModal: (
      state,
      action: PayloadAction<{
        message: string;
        onConfirm: () => void;
        onCancel: () => void;
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
        onOption: (value: string) => void;
        onCancel: () => void;
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
        onSubmit: (data: { content: string; id: string }) => void;
        onCancel: () => void;
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
        onOption: (value: string | number, id: string | number) => void;
        onCancel: () => void;
        position: Position | null;
        id: string | number;
      }>
    ) => {
      state.cursorModal = { ...action.payload, open: true };
    },
    setTitleNContentModal: (
      state,
      action: PayloadAction<{title: string, content: string, onCancel: () => void}>
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
    closeLoadingModal: (state) => {
      state.loadingModal = null;
    },
    closeRejectModal: (state) => {
      state.rejectModal = { open: false, message: "", onCancel: () => {} };
    },
    closeConfirmModal: (state) => {
      state.confirmModal = { open: false, message: "", onConfirm: () => {}, onCancel: () => {} };
    },
    closeOptionModal: (state) => {
      state.optionModal = { open: false, message: "", options: [], onOption: (value: string) => {}, onCancel: () => {} };
    },
    closeSubmitModal: (state) => {
      state.submitModal = { open: false, message: "", initial: { content: "", id: "" }, restriction: undefined, onSubmit: (data: { content: string; id: string }) => {}, onCancel: () => {} };
    },
    closeCursorModal: (state) => {
      state.cursorModal = { open: false, message: "", options: [], onOption: (value: string | number, id: string | number) => {}, onCancel: () => {}, position: null, id: "" };
    },
    closeTitleNContentModal: (state) => {
      state.titleNContentModal = {open: false, title: "", content: "", onCancel: () => {} };
    },

    // 모든 모달을 초기화하는 액션
    closeAll: (state) => {
      state.loginModal = false;
      state.signupModal = false;
      state.findPwModal = false;
      state.findIdModal = false;
      state.loadingModal = null;
      state.rejectModal = { open: false, message: "", onCancel: () => {} };
      state.confirmModal = { open: false, message: "", onConfirm: () => {}, onCancel: () => {} };
      state.optionModal = { open: false, message: "", options: [], onOption: (value: string) => {}, onCancel: () => {} };
      state.submitModal = { open: false, message: "", initial: { content: "", id: "" }, restriction: undefined, onSubmit: (data: { content: string; id: string }) => {}, onCancel: () => {} };
      state.cursorModal = { open: false, message: "", options: [], onOption: (value: string | number, id: string | number) => {}, onCancel: () => {}, position: null, id: "" };
      state.titleNContentModal = {open : false, title: "", content: "", onCancel: () => {} };
    },
  },
});

export const {
  openModal,
  openLoadingModal,
  setRejectModal,
  setConfirmModal,
  setOptionModal,
  setSubmitModal,
  setCursorModal,
  setTitleNContentModal,
  closeLoadingModal,
  closeModal,
  closeRejectModal,
  closeConfirmModal,
  closeOptionModal,
  closeSubmitModal,
  closeCursorModal,
  closeTitleNContentModal,
  closeAll,
} = ModalReducer.actions;

export default ModalReducer.reducer;

