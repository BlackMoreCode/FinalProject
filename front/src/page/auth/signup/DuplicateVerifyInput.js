"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recoil_1 = require("recoil");
const react_1 = require("react");
const react_2 = __importDefault(require("react"));
const Style_1 = require("../Style");
const Selector_1 = require("../../../context/recoil/Selector");
const DuplicateVerifyInput = ({ state, type = "text", label, setter, }) => {
    const [info, setInfo] = (0, recoil_1.useRecoilState)(state);
    const validationResult = (0, recoil_1.useRecoilValue)((0, Selector_1.validationSelectorFamily)(state));
    // 입력 변경 핸들러
    const handleChange = (e) => {
        setInfo((prev) => (Object.assign(Object.assign({}, prev), { value: e.target.value })));
    };
    // 값이 변경될 때마다 자동으로 검증 실행
    (0, react_1.useEffect)(() => {
        setInfo(validationResult);
    }, [validationResult]);
    (0, react_1.useEffect)(() => {
        setter((info.isValidFormat && !info.isDuplicate) ? info.value : "", label);
    }, [validationResult]);
    return (react_2.default.createElement(Style_1.InputContainer, null,
        react_2.default.createElement("p", null, label),
        react_2.default.createElement(Style_1.Input, { type: type, placeholder: `${label}을 입력해 주세요`, value: info.value, onChange: handleChange }),
        info.message && react_2.default.createElement(Style_1.Message, { isValid: info.isValidFormat && !info.isDuplicate }, info.message)));
};
exports.default = DuplicateVerifyInput;
