"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const ModalReducer_1 = require("../../context/redux/ModalReducer");
const material_1 = require("@mui/material");
const OptionsModal = () => {
    var _a, _b;
    const optionModal = (0, react_redux_1.useSelector)((state) => state.modal.optionModal);
    const dispatch = (0, react_redux_1.useDispatch)();
    if (!optionModal.open)
        return null;
    const onCancel = () => {
        var _a;
        (_a = optionModal.onCancel) === null || _a === void 0 ? void 0 : _a.call(optionModal);
        dispatch((0, ModalReducer_1.closeOptionModal)());
    };
    return (react_1.default.createElement(material_1.Dialog, { open: optionModal.open, onClose: onCancel, maxWidth: "xs", fullWidth: true },
        react_1.default.createElement(material_1.DialogTitle, null, "\uC54C\uB9BC"),
        react_1.default.createElement(material_1.DialogContent, { dividers: true }, (_a = optionModal.message) === null || _a === void 0 ? void 0 : _a.split("\n").map((line, index) => (react_1.default.createElement("p", { key: index, style: { margin: 0 } }, line)))),
        react_1.default.createElement(material_1.DialogActions, null, (_b = optionModal.options) === null || _b === void 0 ? void 0 :
            _b.map((option, index) => (react_1.default.createElement(material_1.Button, { key: index, variant: option.type === "outlined" ? "outlined" : "contained", color: option.type === "outlined" ? "error" : "primary", onClick: () => optionModal.onOption(option.value), fullWidth: true }, option.label))),
            react_1.default.createElement(material_1.Button, { variant: "outlined", color: "error", onClick: onCancel, fullWidth: true }, "\uCDE8\uC18C"))));
};
exports.default = OptionsModal;
