"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const react_redux_1 = require("react-redux");
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const ModalReducer_1 = require("../../context/redux/ModalReducer");
const ConfirmModal = () => {
    // Redux 상태에 대한 타입 지정
    const confirm = (0, react_redux_1.useSelector)((state) => state.modal.confirmModal);
    const dispatcher = (0, react_redux_1.useDispatch)();
    const onCancel = () => {
        confirm.onCancel();
        dispatcher((0, ModalReducer_1.closeConfirmModal)());
    };
    const onConfirm = () => {
        confirm.onConfirm();
        dispatcher((0, ModalReducer_1.closeConfirmModal)());
    };
    return (react_1.default.createElement(material_1.Dialog, { open: confirm.open, onClose: onCancel, maxWidth: "xs", fullWidth: true },
        react_1.default.createElement(CustomDialogContent, null,
            react_1.default.createElement(material_1.Typography, { variant: "h6", gutterBottom: true }, confirm.message &&
                confirm.message.split("\n").map((line, index) => (react_1.default.createElement("span", { key: index },
                    line,
                    react_1.default.createElement("br", null)))))),
        react_1.default.createElement(material_1.DialogActions, null,
            react_1.default.createElement(StyledButton, { variant: "contained", color: "primary", onClick: onConfirm }, "\uD655\uC778"),
            react_1.default.createElement(StyledButton, { variant: "outlined", color: "error", onClick: onCancel }, "\uCDE8\uC18C"))));
};
exports.default = ConfirmModal;
// 스타일 추가
const CustomDialogContent = (0, styled_components_1.default)(material_1.DialogContent) `
    text-align: center;
    padding: 24px;
`;
const StyledButton = (0, styled_components_1.default)(material_1.Button) `
width: 100px;
margin: 8px;
`;
