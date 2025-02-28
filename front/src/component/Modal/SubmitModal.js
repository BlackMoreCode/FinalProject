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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const material_1 = require("@mui/material");
const styled_components_1 = __importDefault(require("styled-components"));
const react_redux_1 = require("react-redux");
const ModalReducer_1 = require("../../context/redux/ModalReducer");
const SubmitModal = () => {
    const submit = (0, react_redux_1.useSelector)((state) => state.modal.submitModal);
    const dispatcher = (0, react_redux_1.useDispatch)();
    const [content, setContent] = (0, react_1.useState)("");
    const [id, setId] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        setContent(submit.initial.content);
        setId(submit.initial.id);
    }, [submit.initial]);
    const onChangeContent = (e) => {
        if (submit.restriction) {
            dispatcher((0, ModalReducer_1.setRejectModal)({ message: submit.restriction, onCancel: () => { } }));
            return;
        }
        setContent(e.target.value);
    };
    const onSubmitHandler = () => {
        if (content.trim() === "") {
            dispatcher((0, ModalReducer_1.setRejectModal)({ message: "메세지를 입력하세요.", onCancel: () => { } }));
            return;
        }
        submit.onSubmit({ content: content, id: id }); // 댓글 제출 또는 수정 처리
        setContent(""); // 내용 초기화
        onCancel(); // 모달 닫기
    };
    const onCancel = () => {
        submit.onCancel();
        dispatcher((0, ModalReducer_1.closeSubmitModal)());
    };
    if (!submit.open)
        return null;
    return (react_1.default.createElement(material_1.Dialog, { open: submit.open, onClose: onCancel, maxWidth: "xs", fullWidth: true },
        react_1.default.createElement(CustomDialogContent, null,
            react_1.default.createElement(material_1.Typography, { variant: "h6", gutterBottom: true }, submit.message &&
                submit.message.split("\n").map((line, index) => (react_1.default.createElement("span", { key: index },
                    line,
                    react_1.default.createElement("br", null))))),
            react_1.default.createElement(material_1.TextField, { onChange: onChangeContent, value: content, multiline: true, minRows: 3, maxRows: 8 })),
        react_1.default.createElement(material_1.DialogActions, null,
            react_1.default.createElement(StyledButton, { variant: "contained", color: "primary", onClick: onSubmitHandler }, "\uC81C\uCD9C"),
            react_1.default.createElement(StyledButton, { variant: "outlined", color: "error", onClick: onCancel }, "\uCDE8\uC18C"))));
};
exports.default = SubmitModal;
// 스타일 추가
const CustomDialogContent = (0, styled_components_1.default)(material_1.DialogContent) `
	text-align: center;
	padding: 24px;
`;
const StyledButton = (0, styled_components_1.default)(material_1.Button) `
	width: 100px;
	margin: 8px;
`;
