"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importDefault(require("styled-components"));
const react_redux_1 = require("react-redux");
const ModalReducer_1 = require("../../context/redux/ModalReducer");
const react_1 = __importDefault(require("react")); // React를 명시적으로 import
// 나머지 코드...
const CursorModal = () => {
    const cursor = (0, react_redux_1.useSelector)((state) => state.modal.cursorModal);
    const dispatcher = (0, react_redux_1.useDispatch)();
    if (!cursor.open || !cursor.position)
        return null;
    const onCancel = () => {
        cursor.onCancel();
        dispatcher((0, ModalReducer_1.closeCursorModal)());
    };
    const onOption = (value) => {
        cursor.onOption(value, cursor.id);
        dispatcher((0, ModalReducer_1.closeCursorModal)());
    };
    return (react_1.default.createElement(ModalOverlay, { onClick: onCancel },
        react_1.default.createElement(ModalContainer, { style: {
                top: `${cursor.position.y}px`,
                left: `${cursor.position.x + 10}px`,
                transform: "translateY(100%)"
            } },
            react_1.default.createElement(ModalContent, null,
                cursor.message && react_1.default.createElement(MessageText, null, cursor.message),
                cursor.options.map((option, index) => (react_1.default.createElement(ModalButton, { key: index, onClick: () => onOption(option.value) }, option.label)))))));
};
exports.default = CursorModal;
// ✅ 스타일 정의
const ModalContainer = styled_components_1.default.div `
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const ModalContent = styled_components_1.default.div `
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 200px;
	height: 150px;
  position: relative;
  margin: 10px 0;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;
const ModalButton = styled_components_1.default.button `
    width: 200px;
    font-size: 0.8rem;
    font-weight: bold;
    cursor: pointer;
    color: black;
    background-color: white;
    border: none;
    border-radius: 8px;
    text-align: center;
    
`;
const MessageText = styled_components_1.default.div `
    font-size: 0.8rem;
    font-weight: bold;
    margin-bottom: 12px;
`;
const ModalOverlay = styled_components_1.default.div `
	display: flex;
	position: fixed;
	width: 100vw;
	height: 100vh;
    z-index: 999;
	left: 0;
	top: 0;
`;
