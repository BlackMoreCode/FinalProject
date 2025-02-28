"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const ModalReducer_1 = require("../../context/redux/ModalReducer");
const material_1 = require("@mui/material");
const TitleNContentModal = () => {
    const modal = (0, react_redux_1.useSelector)((state) => state.modal.titleNContentModal);
    const dispatch = (0, react_redux_1.useDispatch)();
    const onClose = () => {
        var _a;
        (_a = modal.onCancel) === null || _a === void 0 ? void 0 : _a.call(modal); // onCancel이 정의된 경우 실행
        dispatch((0, ModalReducer_1.closeTitleNContentModal)());
    };
    return (react_1.default.createElement(material_1.Dialog, { open: modal.open, onClose: onClose, maxWidth: "sm", fullWidth: true },
        react_1.default.createElement(material_1.DialogTitle, null, modal.title),
        react_1.default.createElement(material_1.DialogContent, { dividers: true },
            react_1.default.createElement("p", { style: { whiteSpace: "pre-line", lineHeight: "1.5" } }, modal.content)),
        react_1.default.createElement(material_1.DialogActions, null,
            react_1.default.createElement(material_1.Button, { onClick: onClose, variant: "contained", color: "primary" }, "\uB2EB\uAE30"))));
};
exports.default = TitleNContentModal;
