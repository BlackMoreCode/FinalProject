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
const Profile_1 = __importDefault(require("./Profile"));
const ProfileTaps_1 = __importDefault(require("./ProfileTaps"));
const ProfilePageStyle_1 = require("./style/ProfilePageStyle");
const ProfilePage = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    // 실제로는 백엔드에서 fetch하거나 props로 받을 수 있게
    const [user, setUser] = (0, react_1.useState)({
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
    const handleStyleChange = (e) => {
        const { name, value } = e.target;
        setCustomStyle((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    (0, react_1.useEffect)(() => {
        // 예: 페이지 로딩 시 유저 정보 불러오기
        // fetch('/api/user/profile')
        //   .then((res) => res.json())
        //   .then((data) => setUser(data))
        //   .catch((err) => console.error(err));
    }, []);
    const handlePaymentClick = () => {
        navigate("/sandbox"); // 결제 페이지로 이동
    };
    return (react_1.default.createElement(ProfilePageStyle_1.ProfilePageContainer, null,
        react_1.default.createElement(ProfilePageStyle_1.ProfilePageHeader, null,
            react_1.default.createElement(ProfilePageStyle_1.HeaderUp, null,
                react_1.default.createElement(Profile_1.default, { user: user, customStyle: customStyle }),
                react_1.default.createElement(ProfilePageStyle_1.ProfileButtonContainer, null,
                    react_1.default.createElement(ProfilePageStyle_1.ProfileButton, null,
                        react_1.default.createElement(ProfilePageStyle_1.EditIcon, null),
                        react_1.default.createElement("span", null, "\uD504\uB85C\uD544 \uD3B8\uC9D1")),
                    react_1.default.createElement(ProfilePageStyle_1.ProfileButton, { onClick: handlePaymentClick },
                        react_1.default.createElement("span", null, "\uACB0\uC81C\uD558\uAE30")))),
            react_1.default.createElement(ProfilePageStyle_1.HeaderDown, null,
                react_1.default.createElement(ProfilePageStyle_1.UserStats, null,
                    react_1.default.createElement("span", null,
                        "\uAC8C\uC2DC\uAE00: ",
                        react_1.default.createElement("strong", null, user.postsCount)),
                    react_1.default.createElement("span", null,
                        "\uBC1B\uC740 \uCD94\uCC9C: ",
                        react_1.default.createElement("strong", null, user.likesCount))))),
        react_1.default.createElement("div", null,
            react_1.default.createElement("label", null,
                "\uBC30\uACBD\uC0C9:",
                react_1.default.createElement("input", { type: "color", name: "bgColor", value: customStyle.bgColor, onChange: handleStyleChange })),
            react_1.default.createElement("br", null),
            react_1.default.createElement("label", null,
                "\uB2C9\uB124\uC784 \uD3F0\uD2B8:",
                react_1.default.createElement("select", { name: "nicknameFont", value: customStyle.nicknameFont, onChange: handleStyleChange },
                    react_1.default.createElement("option", { value: "Arial, sans-serif" }, "Arial"),
                    react_1.default.createElement("option", { value: "Courier New, monospace" }, "Courier New"),
                    react_1.default.createElement("option", { value: "Georgia, serif" }, "Georgia"),
                    react_1.default.createElement("option", { value: "Tahoma, sans-serif" }, "Tahoma"))),
            react_1.default.createElement("label", null,
                "\uB2C9\uB124\uC784 \uD3F0\uD2B8 \uD06C\uAE30:",
                react_1.default.createElement("input", { type: "range", name: "nicknameSize" // 수정된 부분
                    , min: "1.0", max: "2.9", step: "0.1", value: parseFloat(customStyle.nicknameSize), onChange: (e) => setCustomStyle((prev) => (Object.assign(Object.assign({}, prev), { nicknameSize: `${e.target.value}rem` }))) }),
                react_1.default.createElement("input", { type: "number", value: parseFloat(customStyle.nicknameSize), readOnly: true, style: {
                        width: "50px",
                        marginLeft: "10px",
                        textAlign: "center",
                        border: "none",
                        background: "transparent",
                    } })),
            react_1.default.createElement("br", null),
            react_1.default.createElement("label", null,
                "\uC18C\uAC1C \uD3F0\uD2B8:",
                react_1.default.createElement("select", { name: "introduceFont", value: customStyle.introduceFont, onChange: handleStyleChange },
                    react_1.default.createElement("option", { value: "Arial, sans-serif" }, "Arial"),
                    react_1.default.createElement("option", { value: "Courier New, monospace" }, "Courier New"),
                    react_1.default.createElement("option", { value: "Georgia, serif" }, "Georgia"),
                    react_1.default.createElement("option", { value: "Tahoma, sans-serif" }, "Tahoma"))),
            react_1.default.createElement("label", null,
                "\uC18C\uAC1C \uD3F0\uD2B8 \uD06C\uAE30:",
                react_1.default.createElement("input", { type: "range", name: "introduceSize" // 수정된 부분
                    , min: "0.8", max: "1.5", step: "0.1", value: parseFloat(customStyle.introduceSize), onChange: (e) => setCustomStyle((prev) => (Object.assign(Object.assign({}, prev), { introduceSize: `${e.target.value}rem` }))) }),
                react_1.default.createElement("input", { type: "number", value: parseFloat(customStyle.introduceSize), readOnly: true, style: {
                        width: "50px",
                        marginLeft: "10px",
                        textAlign: "center",
                        border: "none",
                        background: "transparent",
                    } }))),
        react_1.default.createElement(ProfileTaps_1.default, null)));
};
exports.default = ProfilePage;
