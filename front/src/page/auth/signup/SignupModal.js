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
const react_1 = __importDefault(require("react"));
const recoil_1 = require("recoil");
const AuthState_1 = require("../../../context/recoil/AuthState");
const react_redux_1 = require("react-redux");
const DuplicateVerifyInput_1 = __importDefault(require("./DuplicateVerifyInput"));
const MatchInput_1 = __importDefault(require("./MatchInput"));
const material_1 = require("@mui/material");
const Style_1 = require("../Style");
const ModalReducer_1 = require("../../../context/redux/ModalReducer");
const VerifyPhone_1 = __importDefault(require("./VerifyPhone"));
const TermsContainer_1 = __importDefault(require("./TermsContainer"));
const AuthApi_1 = __importDefault(require("../../../api/AuthApi"));
const SignupModal = () => {
    const signup = (0, react_redux_1.useSelector)((state) => state.modal.signupModal);
    if (!signup)
        return null;
    const dispatch = (0, react_redux_1.useDispatch)();
    const [check, setCheck] = (0, recoil_1.useRecoilState)(AuthState_1.isChecked);
    const setter = (value, type) => {
        switch (type) {
            case "이메일":
                setCheck((prev) => (Object.assign(Object.assign({}, prev), { email: value })));
                break;
            case "비밀번호":
                setCheck((prev) => (Object.assign(Object.assign({}, prev), { password: value })));
                break;
            case "닉네임":
                setCheck((prev) => (Object.assign(Object.assign({}, prev), { nickname: value })));
                break;
            case "전화번호":
                setCheck((prev) => (Object.assign(Object.assign({}, prev), { phone: value })));
                break;
            default:
                break;
        }
    };
    const verifySetter = (value, type) => {
        switch (type) {
            case "이용":
                setCheck((prev) => (Object.assign(Object.assign({}, prev), { serviceTerm: value })));
                break;
            case "개인정보":
                setCheck((prev) => (Object.assign(Object.assign({}, prev), { privacyTerm: value })));
                break;
            case "전화번호":
                setCheck((prev) => (Object.assign(Object.assign({}, prev), { verifyPhone: value })));
                break;
            default:
                break;
        }
        const isValid = Object.values(check).every((value) => value !== false && value !== "");
        const onClickSignup = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const signupReq = {
                    email: check.email,
                    phone: check.phone,
                    pwd: check.password,
                    nickname: check.nickname,
                };
                const rsp = yield AuthApi_1.default.signup(signupReq);
                if (rsp.data === "성공") {
                    dispatch((0, ModalReducer_1.setConfirmModal)({
                        message: "회원가입에 성공했습니다.\n바로 로그인 하시겠습니까?",
                        onConfirm: () => dispatch((0, ModalReducer_1.openModal)("login")),
                        onCancel: () => {
                        }
                    }));
                    dispatch((0, ModalReducer_1.closeModal)("signup"));
                }
                else {
                    dispatch((0, ModalReducer_1.setRejectModal)({
                        message: `${rsp.data}의 이유로 회원가입에 실패했습니다.`, onCancel: () => {
                        }
                    }));
                }
            }
            catch (e) {
                console.error(e);
                dispatch((0, ModalReducer_1.setRejectModal)({
                    message: "서버와의 통신 불가의 이유로 회원가입에 실패했습니다.", onCancel: () => {
                    }
                }));
            }
        });
        return (react_1.default.createElement(material_1.Dialog, { open: signup },
            react_1.default.createElement("h3", null, "\uD68C\uC6D0\uAC00\uC785"),
            react_1.default.createElement(DuplicateVerifyInput_1.default, { state: AuthState_1.emailState, setter: setter, label: "\uC774\uBA54\uC77C" }),
            react_1.default.createElement(MatchInput_1.default, { setter: setter }),
            react_1.default.createElement(DuplicateVerifyInput_1.default, { state: AuthState_1.nicknameState, setter: setter, label: '\uB2C9\uB124\uC784' }),
            react_1.default.createElement(DuplicateVerifyInput_1.default, { state: AuthState_1.phoneState, setter: setter, label: "\uC804\uD654\uBC88\uD638" }),
            react_1.default.createElement(VerifyPhone_1.default, { setter: verifySetter, phone: check.phone }),
            react_1.default.createElement(TermsContainer_1.default, { setter: verifySetter, privacyTerm: check.privacyTerm, serviceTerm: check.serviceTerm }),
            react_1.default.createElement(Style_1.ButtonContainer, null,
                react_1.default.createElement(Style_1.SignupButton, { disabled: !isValid, onClick: onClickSignup }, "\uAC00\uC785\uD558\uAE30"))));
    };
};
exports.default = SignupModal;
