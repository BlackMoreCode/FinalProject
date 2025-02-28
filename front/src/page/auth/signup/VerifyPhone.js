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
const Style_1 = require("../Style");
const recoil_1 = require("recoil");
const AuthState_1 = require("../../../context/recoil/AuthState");
const ModalReducer_1 = require("../../../context/redux/ModalReducer");
const react_redux_1 = require("react-redux");
const AuthApi_1 = __importDefault(require("../../../api/AuthApi"));
const Common_1 = __importDefault(require("../../../util/Common"));
const PhoneVerification = ({ phone, setter }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const [verify, setVerify] = (0, recoil_1.useRecoilState)(AuthState_1.verifyPhone);
    const [isRequestInProgress, setIsRequestInProgress] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (phone) {
            setVerify((prev) => (Object.assign(Object.assign({}, prev), { timer: 300, active: true })));
        }
    }, [phone]);
    (0, react_1.useEffect)(() => {
        if (verify.active && verify.timer > 0) {
            const timer = setInterval(() => {
                setVerify((prev) => (Object.assign(Object.assign({}, prev), { timer: prev.timer - 1 })));
            }, 1000);
            return () => clearInterval(timer);
        }
        else if (verify.timer <= 0) {
            setVerify((prev) => (Object.assign(Object.assign({}, prev), { active: false })));
            dispatch((0, ModalReducer_1.setRejectModal)({
                message: "인증 시간이 만료되었습니다. 다시 요청해주세요.",
                onCancel: () => { },
            }));
        }
    }, [verify.active]);
    const onClickPhoneVerify = () => __awaiter(void 0, void 0, void 0, function* () {
        if (isRequestInProgress)
            return;
        setIsRequestInProgress(true);
        if (!phone) {
            setIsRequestInProgress(false);
            return;
        }
        try {
            const rsp = yield AuthApi_1.default.sendVerificationCode(phone);
            console.log("서버 응답:", rsp);
            if (rsp.data) {
                setVerify((prev) => (Object.assign(Object.assign({}, prev), { active: true, timer: 300 })));
                dispatch((0, ModalReducer_1.setRejectModal)({
                    message: "인증번호가 발송되었습니다.",
                    onCancel: () => { },
                }));
            }
            else if (rsp.data === "EXCEED_LIMIT") {
                dispatch((0, ModalReducer_1.setRejectModal)({
                    message: "인증번호 발송 횟수를 초과했습니다. 5시간 후 다시 시도해주세요.",
                    onCancel: () => { },
                }));
            }
            else {
                dispatch((0, ModalReducer_1.setRejectModal)({
                    message: "인증 과정중 오류로 인증을 실패했습니다.",
                    onCancel: () => { },
                }));
            }
        }
        catch (error) {
            console.error("인증번호 발송 요청 중 에러 발생:", error);
            dispatch((0, ModalReducer_1.setRejectModal)({
                message: "서버와의 통신 문제로 인증을 실패했습니다.",
                onCancel: () => { },
            }));
        }
        finally {
            setIsRequestInProgress(false);
        }
    });
    const onVerify = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rsp = yield AuthApi_1.default.verifySmsToken(phone, verify.verify);
            if (rsp.data) {
                dispatch((0, ModalReducer_1.setRejectModal)({ message: "인증번호가 유효합니다.", onCancel: () => { } }));
                setter(true, "전화번호");
            }
            else {
                setVerify((prev) => (Object.assign(Object.assign({}, prev), { verified: false })));
                dispatch((0, ModalReducer_1.setRejectModal)({
                    message: "인증번호가 유효하지 않거나 만료되었습니다.",
                    onCancel: () => { },
                }));
                setter(false, "전화번호");
            }
        }
        catch (error) {
            setVerify((prev) => (Object.assign(Object.assign({}, prev), { verified: false })));
            dispatch((0, ModalReducer_1.setRejectModal)({
                message: "인증번호 확인 중 오류가 발생했습니다.",
                onCancel: () => { },
            }));
            setter(false, "전화번호");
        }
    });
    return (react_1.default.createElement(Style_1.InputContainer, null,
        react_1.default.createElement("div", { style: { display: "flex", alignItems: "center" } },
            react_1.default.createElement(Style_1.PhoneVerifyButton, { onClick: onClickPhoneVerify, disabled: isRequestInProgress || !phone, style: { width: "90px" } }, "\uC778\uC99D\uC694\uCCAD")),
        verify.active && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { style: { display: "flex", alignItems: "center", marginTop: "10px" } },
                react_1.default.createElement(Style_1.Input, { type: "text", placeholder: "\uC778\uC99D\uBC88\uD638 \uC785\uB825", value: verify.verify, onChange: (e) => setVerify((prev) => (Object.assign(Object.assign({}, prev), { verify: e.target.value }))), style: { flex: "1", marginRight: "10px" } }),
                react_1.default.createElement(Style_1.PhoneVerifyButton, { onClick: onVerify, disabled: verify.timer <= 0 }, "\uC778\uC99D\uD558\uAE30")),
            react_1.default.createElement("p", { style: { marginTop: "5px", color: verify.timer < 60 ? "red" : "black" } },
                "\uB0A8\uC740 \uC2DC\uAC04: ",
                Common_1.default.formatTime(verify.timer))))));
};
exports.default = PhoneVerification;
