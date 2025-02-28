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
const react_1 = __importStar(require("react"));
const ProfileStyleCustomizer = ({ initialStyle, onChange }) => {
    const [customStyle, setCustomStyle] = (0, react_1.useState)(initialStyle);
    const handleStyleChange = (e) => {
        const { name, value } = e.target;
        const newStyle = Object.assign(Object.assign({}, customStyle), { [name]: value });
        setCustomStyle(newStyle);
        onChange(newStyle);
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h3", null, "\uD504\uB85C\uD544 \uC2A4\uD0C0\uC77C \uBCC0\uACBD"),
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
            "\uB2C9\uB124\uC784 \uD06C\uAE30:",
            react_1.default.createElement("input", { type: "range", name: "nicknameSize", min: "1.0", max: "2.9", step: "0.1", value: parseFloat(customStyle.nicknameSize), onChange: (e) => handleStyleChange({
                    target: { name: "nicknameSize", value: `${e.target.value}rem` },
                }) }),
            react_1.default.createElement("input", { type: "number", value: parseFloat(customStyle.nicknameSize), readOnly: true })),
        react_1.default.createElement("br", null),
        react_1.default.createElement("label", null,
            "\uC18C\uAC1C \uD3F0\uD2B8:",
            react_1.default.createElement("select", { name: "introduceFont", value: customStyle.introduceFont, onChange: handleStyleChange },
                react_1.default.createElement("option", { value: "Arial, sans-serif" }, "Arial"),
                react_1.default.createElement("option", { value: "Courier New, monospace" }, "Courier New"),
                react_1.default.createElement("option", { value: "Georgia, serif" }, "Georgia"),
                react_1.default.createElement("option", { value: "Tahoma, sans-serif" }, "Tahoma"))),
        react_1.default.createElement("label", null,
            "\uC18C\uAC1C \uD06C\uAE30:",
            react_1.default.createElement("input", { type: "range", name: "introduceSize", min: "0.8", max: "1.5", step: "0.1", value: parseFloat(customStyle.introduceSize), onChange: (e) => handleStyleChange({
                    target: { name: "introduceSize", value: `${e.target.value}rem` },
                }) }),
            react_1.default.createElement("input", { type: "number", value: parseFloat(customStyle.introduceSize), readOnly: true }))));
};
exports.default = ProfileStyleCustomizer;
