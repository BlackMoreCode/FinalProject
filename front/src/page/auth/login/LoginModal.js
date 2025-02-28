"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const ModalReducer_1 = require("../../../context/redux/ModalReducer");
const Common_1 = __importDefault(require("../../../util/Common"));
const Style_1 = require("../Style");
const TokenReducer_1 = require("../../../context/redux/TokenReducer");
const AuthApi_1 = __importDefault(require("../../../api/AuthApi"));
const axios_1 = __importDefault(require("axios"));
const material_1 = require("@mui/material");
const LoginModal = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const loginModal = (0, react_redux_1.useSelector)((state) => state.modal.loginModal);
    if (!loginModal)
        return null;
    const SNS_SIGN_IN_URL = (type) => `${Common_1.default.BASE_URL}/api/v1/auth/oauth2/${type}`;
    const onSnsSignInButtonClickHandler = (type) => {
        window.location.href = SNS_SIGN_IN_URL(type);
    };
    const [inputEmail, setInputEmail] = (0, react_1.useState)("");
    const [inputPw, setInputPw] = (0, react_1.useState)("");
    const onClickLogin = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const loginReq = { email: inputEmail, pwd: inputPw };
            const res = yield AuthApi_1.default.login(loginReq);
            console.log(res);
            const loginRes = res.data;
            if (loginRes !== null && loginRes.grantType === "Bearer") {
                dispatch((0, TokenReducer_1.setToken)(loginRes.token));
                dispatch((0, ModalReducer_1.closeModal)("login"));
            }
            else {
                console.log("잘못된 아이디 또는 비밀번호 입니다.");
                dispatch((0, ModalReducer_1.setRejectModal)({ message: "ID와 PW가 다릅니다.", onCancel: () => { } }));
            }
        }
        catch (err) {
            if (axios_1.default.isAxiosError(err)) {
                console.log("로그인 에러 : ", err);
                if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 405) {
                    console.log("로그인 실패: 405 Unauthorized");
                    dispatch((0, ModalReducer_1.setRejectModal)({
                        message: "로그인에 실패 하였습니다.",
                        onCancel: () => { },
                    }));
                }
                else {
                    console.log("서버와의 통신에 실패: ", err.message);
                    dispatch((0, ModalReducer_1.setRejectModal)({
                        message: "서버와의 통신에 실패 하였습니다.",
                        onCancel: () => { },
                    }));
                }
            }
            else {
                console.log("예상치 못한 에러 발생: ", err);
                dispatch((0, ModalReducer_1.setRejectModal)({
                    message: "알 수 없는 오류가 발생하였습니다.",
                    onCancel: () => { },
                }));
            }
        }
    });
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // 엔터 키가 눌렸을 때
            onClickLogin(); // 로그인 버튼 클릭 함수 실행
        }
    };
    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };
    return (react_1.default.createElement(material_1.Dialog, { open: loginModal, onClose: () => dispatch((0, ModalReducer_1.closeModal)("login")) },
        react_1.default.createElement(material_1.DialogTitle, null, "\uB85C\uADF8\uC778"),
        react_1.default.createElement("form", { onSubmit: (e) => e.preventDefault() },
            react_1.default.createElement(Style_1.InputField, { type: "text", placeholder: "\uC774\uBA54\uC77C", value: inputEmail, onChange: (e) => handleInputChange(e, setInputEmail), onKeyDown: handleKeyPress }),
            react_1.default.createElement(Style_1.InputField, { type: "password", placeholder: "\uBE44\uBC00\uBC88\uD638", value: inputPw, onChange: (e) => handleInputChange(e, setInputPw), onKeyDown: handleKeyPress }),
            react_1.default.createElement(Style_1.Button, { type: "button", onClick: onClickLogin }, "\uB85C\uADF8\uC778"),
            react_1.default.createElement(Style_1.TextButtonContainer, null,
                react_1.default.createElement("div", null,
                    react_1.default.createElement(Style_1.TextButton, { onClick: () => dispatch((0, ModalReducer_1.openModal)("findId")) }, "\uC774\uBA54\uC77C \uCC3E\uAE30"),
                    react_1.default.createElement(Style_1.Slash, null, "/"),
                    react_1.default.createElement(Style_1.TextButton, { onClick: () => dispatch((0, ModalReducer_1.openModal)("findPw")) }, "\uBE44\uBC00\uBC88\uD638 \uCC3E\uAE30")),
                react_1.default.createElement(Style_1.SignupTextButton, { onClick: () => dispatch((0, ModalReducer_1.openModal)("signup")) }, "\uD68C\uC6D0\uAC00\uC785")),
            react_1.default.createElement(Style_1.Line, null),
            react_1.default.createElement(Style_1.SnsLoginText, null, "SNS \uACC4\uC815 \uAC04\uD3B8 \uB85C\uADF8\uC778"),
            react_1.default.createElement(Style_1.SocialButtonsContainer, null,
                react_1.default.createElement(Style_1.NaverButton, { onClick: () => onSnsSignInButtonClickHandler("naver") },
                    react_1.default.createElement(Style_1.LogoImg, { src: "https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Flogo%2Fnaver_logo.png?alt=media" }),
                    react_1.default.createElement("p", null, "\uB124\uC774\uBC84 \uB85C\uADF8\uC778")),
                react_1.default.createElement(Style_1.KakaoButton, { onClick: () => onSnsSignInButtonClickHandler("kakao") },
                    react_1.default.createElement(Style_1.LogoImg, { src: "https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Flogo%2Fkakao_logo.png?alt=media" }),
                    react_1.default.createElement("p", null, "\uCE74\uCE74\uC624 \uB85C\uADF8\uC778")),
                react_1.default.createElement(Style_1.GoogleButton, { onClick: () => onSnsSignInButtonClickHandler("google") },
                    react_1.default.createElement(Style_1.LogoImg, { src: "https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Flogo%2Fgoogle_logo.png?alt=media" }),
                    react_1.default.createElement("p", null, "\uAD6C\uAE00 \uB85C\uADF8\uC778"))))));
};
exports.default = LoginModal;
