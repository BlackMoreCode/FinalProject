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
const ProfileTabsStyle_1 = require("./style/ProfileTabsStyle");
const ProfileTabs = () => {
    const [activeTab, setActiveTab] = (0, react_1.useState)("calendar");
    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };
    return (react_1.default.createElement(ProfileTabsStyle_1.ProfileTabsContainer, null,
        react_1.default.createElement(ProfileTabsStyle_1.TabMenu, null,
            react_1.default.createElement(ProfileTabsStyle_1.TabList, null,
                react_1.default.createElement(ProfileTabsStyle_1.TabItem, { className: activeTab === "calendar" ? "active" : "", onClick: () => handleTabChange("calendar") }, "\uCE98\uB9B0\uB354"),
                react_1.default.createElement(ProfileTabsStyle_1.TabItem, { className: activeTab === "posts" ? "active" : "", onClick: () => handleTabChange("posts") }, "\uC791\uC131\uAE00"),
                react_1.default.createElement(ProfileTabsStyle_1.TabItem, { className: activeTab === "comments" ? "active" : "", onClick: () => handleTabChange("comments") }, "\uB313\uAE00"),
                react_1.default.createElement(ProfileTabsStyle_1.TabItem, { className: activeTab === "likes" ? "active" : "", onClick: () => handleTabChange("likes") }, "\uC88B\uC544\uC694"))),
        react_1.default.createElement(ProfileTabsStyle_1.TabContent, null,
            activeTab === "calendar" && (react_1.default.createElement(ProfileTabsStyle_1.CalendarSection, null,
                react_1.default.createElement("p", null, "\uCE98\uB9B0\uB354/\uCD9C\uC11D/\uC774\uBCA4\uD2B8 \uC815\uBCF4 \uD45C\uC2DC \uC601\uC5ED"))),
            activeTab === "posts" && (react_1.default.createElement("div", { className: "posts" },
                react_1.default.createElement(ProfileTabsStyle_1.UserPost, null,
                    react_1.default.createElement("h3", null, "\uAC8C\uC2DC\uAE00 \uC81C\uBAA9 1"),
                    react_1.default.createElement("p", null, "\uAC8C\uC2DC\uAE00 \uB0B4\uC6A9 \uC77C\uBD80 \uD45C\uC2DC...")),
                react_1.default.createElement(ProfileTabsStyle_1.UserPost, null,
                    react_1.default.createElement("h3", null, "\uAC8C\uC2DC\uAE00 \uC81C\uBAA9 2"),
                    react_1.default.createElement("p", null, "\uAC8C\uC2DC\uAE00 \uB0B4\uC6A9 \uC77C\uBD80 \uD45C\uC2DC...")))),
            activeTab === "comments" && (react_1.default.createElement("div", { className: "comments" },
                react_1.default.createElement("p", null, "\uB313\uAE00 \uB9AC\uC2A4\uD2B8 \uC608\uC2DC"))),
            activeTab === "likes" && (react_1.default.createElement("div", { className: "likes" },
                react_1.default.createElement("p", null, "\uC88B\uC544\uC694\uD55C \uAE00/\uB313\uAE00 \uB9AC\uC2A4\uD2B8 \uC608\uC2DC"))))));
};
exports.default = ProfileTabs;
