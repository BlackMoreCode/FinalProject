"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const material_1 = require("@mui/material");
const material_2 = require("@mui/material");
const LoadingModal = () => {
    const loading = (0, react_redux_1.useSelector)((state) => state.modal.loadingModal);
    if (!loading)
        return null;
    return (react_1.default.createElement(material_1.Modal, { open: loading.open },
        react_1.default.createElement("div", { style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                textAlign: 'center',
                padding: '20px',
            } },
            react_1.default.createElement(material_2.CircularProgress, null),
            react_1.default.createElement(material_1.Typography, { style: { marginTop: '10px', color: '#fff' } }, loading.message))));
};
exports.default = LoadingModal;
