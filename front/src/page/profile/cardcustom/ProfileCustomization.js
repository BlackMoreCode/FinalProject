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
const react_router_dom_1 = require("react-router-dom");
const ProfileStyleCustomizer_1 = __importDefault(require("./ProfileStyleCustomizer"));
const Profile_1 = __importDefault(require("../Profile"));
const ProfileCustomization = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [user] = (0, react_1.useState)({
        name: "홍길동",
        introduce: "동에 번쩍 서에 번쩍",
        profileImg: "",
        postsCount: 12,
        likesCount: 25,
    });
    const [customStyle, setCustomStyle] = (0, react_1.useState)({
        bgColor: "#ffffff",
        nicknameFont: "Arial, sans-serif",
        nicknameSize: "1.5rem",
        introduceFont: "Georgia, serif",
        introduceSize: "1rem",
    });
    const handleSave = () => {
        // 여기에서 저장 로직을 추가할 수 있음 (ex. localStorage, API 요청)
        navigate("/profile");
    };
    return (react_1.default.createElement("div", { style: {
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "20px",
        } },
        react_1.default.createElement("h2", null, "\uD504\uB85C\uD544 \uC2A4\uD0C0\uC77C \uCEE4\uC2A4\uD130\uB9C8\uC774\uC9D5"),
        react_1.default.createElement(Profile_1.default, { user: user, customStyle: customStyle }),
        react_1.default.createElement(ProfileStyleCustomizer_1.default, { initialStyle: customStyle, onChange: setCustomStyle }),
        react_1.default.createElement("button", { onClick: handleSave }, "\uC800\uC7A5 \uD6C4 \uB3CC\uC544\uAC00\uAE30")));
};
exports.default = ProfileCustomization;
