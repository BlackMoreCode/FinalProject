"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeAll = exports.closeTitleNContentModal = exports.closeCursorModal = exports.closeSubmitModal = exports.closeOptionModal = exports.closeConfirmModal = exports.closeRejectModal = exports.closeModal = exports.closeLoadingModal = exports.setTitleNContentModal = exports.setCursorModal = exports.setSubmitModal = exports.setOptionModal = exports.setConfirmModal = exports.setRejectModal = exports.openLoadingModal = exports.openModal = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
// 초기 상태 설정
const initialState = {
    loginModal: false,
    signupModal: false,
    findIdModal: false,
    findPwModal: false,
    loadingModal: null,
    rejectModal: {
        open: false,
        message: "",
        onCancel: () => { },
    },
    confirmModal: {
        open: false,
        message: "",
        onConfirm: () => { },
        onCancel: () => { },
    },
    optionModal: {
        open: false,
        message: "",
        options: [],
        onOption: (value) => { },
        onCancel: () => { },
    },
    submitModal: {
        open: false,
        message: "",
        initial: {
            content: "",
            id: "",
        },
        restriction: undefined,
        onSubmit: (data) => { },
        onCancel: () => { },
    },
    cursorModal: {
        open: false,
        message: "",
        options: [],
        onOption: (value, id) => { },
        onCancel: () => { },
        position: null,
        id: "",
    },
    titleNContentModal: {
        open: false,
        title: "",
        content: "",
        onCancel: () => { },
    }
};
const ModalReducer = (0, toolkit_1.createSlice)({
    name: "modal",
    initialState,
    reducers: {
        // 로그인과 회원가입 모달을 토글하는 액션
        openModal: (state, action) => {
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
        openLoadingModal: (state, action) => {
            state.loadingModal = Object.assign(Object.assign({}, action.payload), { open: true });
        },
        // rejectModal의 값 설정
        setRejectModal: (state, action) => {
            state.rejectModal = Object.assign(Object.assign({}, action.payload), { open: true });
        },
        // confirmModal의 값 설정
        setConfirmModal: (state, action) => {
            state.confirmModal = Object.assign(Object.assign({}, action.payload), { open: true });
        },
        // optionModal의 값 설정
        setOptionModal: (state, action) => {
            state.optionModal = Object.assign(Object.assign({}, action.payload), { open: true });
        },
        // submitModal의 값 설정
        setSubmitModal: (state, action) => {
            state.submitModal = Object.assign(Object.assign({}, action.payload), { open: true });
        },
        // cursorModal의 값 설정
        setCursorModal: (state, action) => {
            state.cursorModal = Object.assign(Object.assign({}, action.payload), { open: true });
        },
        setTitleNContentModal: (state, action) => {
            state.titleNContentModal = Object.assign(Object.assign({}, action.payload), { open: true });
        },
        // 각각의 모달을 개별적으로 초기화하는 액션
        closeModal: (state, action) => {
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
            state.rejectModal = { open: false, message: "", onCancel: () => { } };
        },
        closeConfirmModal: (state) => {
            state.confirmModal = { open: false, message: "", onConfirm: () => { }, onCancel: () => { } };
        },
        closeOptionModal: (state) => {
            state.optionModal = { open: false, message: "", options: [], onOption: (value) => { }, onCancel: () => { } };
        },
        closeSubmitModal: (state) => {
            state.submitModal = { open: false, message: "", initial: { content: "", id: "" }, restriction: undefined, onSubmit: (data) => { }, onCancel: () => { } };
        },
        closeCursorModal: (state) => {
            state.cursorModal = { open: false, message: "", options: [], onOption: (value, id) => { }, onCancel: () => { }, position: null, id: "" };
        },
        closeTitleNContentModal: (state) => {
            state.titleNContentModal = { open: false, title: "", content: "", onCancel: () => { } };
        },
        // 모든 모달을 초기화하는 액션
        closeAll: (state) => {
            state.loginModal = false;
            state.signupModal = false;
            state.findPwModal = false;
            state.findIdModal = false;
            state.loadingModal = null;
            state.rejectModal = { open: false, message: "", onCancel: () => { } };
            state.confirmModal = { open: false, message: "", onConfirm: () => { }, onCancel: () => { } };
            state.optionModal = { open: false, message: "", options: [], onOption: (value) => { }, onCancel: () => { } };
            state.submitModal = { open: false, message: "", initial: { content: "", id: "" }, restriction: undefined, onSubmit: (data) => { }, onCancel: () => { } };
            state.cursorModal = { open: false, message: "", options: [], onOption: (value, id) => { }, onCancel: () => { }, position: null, id: "" };
            state.titleNContentModal = { open: false, title: "", content: "", onCancel: () => { } };
        },
    },
});
_a = ModalReducer.actions, exports.openModal = _a.openModal, exports.openLoadingModal = _a.openLoadingModal, exports.setRejectModal = _a.setRejectModal, exports.setConfirmModal = _a.setConfirmModal, exports.setOptionModal = _a.setOptionModal, exports.setSubmitModal = _a.setSubmitModal, exports.setCursorModal = _a.setCursorModal, exports.setTitleNContentModal = _a.setTitleNContentModal, exports.closeLoadingModal = _a.closeLoadingModal, exports.closeModal = _a.closeModal, exports.closeRejectModal = _a.closeRejectModal, exports.closeConfirmModal = _a.closeConfirmModal, exports.closeOptionModal = _a.closeOptionModal, exports.closeSubmitModal = _a.closeSubmitModal, exports.closeCursorModal = _a.closeCursorModal, exports.closeTitleNContentModal = _a.closeTitleNContentModal, exports.closeAll = _a.closeAll;
exports.default = ModalReducer.reducer;
