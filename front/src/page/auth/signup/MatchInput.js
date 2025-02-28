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
Object.defineProperty(exports, "__esModule", { value: true });
const recoil_1 = require("recoil");
const AuthState_1 = require("../../../context/recoil/AuthState");
const Selector_1 = require("../../../context/recoil/Selector");
const Style_1 = require("../Style");
const react_1 = __importStar(require("react"));
const MatchInput = ({ setter }) => {
    const [info, setInfo] = (0, recoil_1.useRecoilState)(AuthState_1.passwordState);
    const pwdValid = (0, recoil_1.useRecoilValue)(Selector_1.isPasswordMatchState);
    const onChangePassword = (e) => {
        setInfo((prev) => (Object.assign(Object.assign({}, prev), { value: e.target.value })));
    };
    const onChangePwdConfirm = (e) => {
        setInfo((prev) => (Object.assign(Object.assign({}, prev), { confirmValue: e.target.value })));
    };
    (0, react_1.useEffect)(() => {
        setInfo((prev) => (Object.assign(Object.assign({}, prev), { pwdValid })));
    }, [pwdValid]);
    (0, react_1.useEffect)(() => {
        // setter를 통해 info.isValidFormat && !info.isDuplicate인 경우 value를 넘긴다
        setter(info.isValidFormat && info.isDuplicate ? info.value : "", "비밀번호");
    }, [pwdValid]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Style_1.InputContainer, null,
            react_1.default.createElement("p", null, "\uBE44\uBC00\uBC88\uD638"),
            react_1.default.createElement(Style_1.Input, { type: "password", placeholder: "\uBE44\uBC00\uBC88\uD638\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694", value: info.value, onChange: onChangePassword }),
            info.message && react_1.default.createElement(Style_1.Message, { isValid: info.isValidFormat }, info.message)),
        react_1.default.createElement(Style_1.InputContainer, null,
            react_1.default.createElement("p", null, "\uBE44\uBC00\uBC88\uD638 \uD655\uC778"),
            react_1.default.createElement(Style_1.Input, { type: "password", placeholder: "\uBE44\uBC00\uBC88\uD638\uB97C \uB2E4\uC2DC \uC785\uB825\uD574 \uC8FC\uC138\uC694", value: info.confirmValue, onChange: onChangePwdConfirm, disabled: !info.isValidFormat }),
            info.isValidFormat && info.message && react_1.default.createElement(Style_1.Message, { isValid: info.isDuplicate }, info.message))));
};
exports.default = MatchInput;
