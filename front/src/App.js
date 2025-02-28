"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Header_1 = __importDefault(require("./component/header/Header"));
const MainContainer_1 = __importDefault(require("./component/MainContainer"));
const ProfilePage_1 = __importDefault(require("./page/profile/ProfilePage"));
const Checkout_1 = require("./component/payments/Checkout");
const Succeess_1 = require("./component/payments/Succeess");
const Fail_1 = require("./component/payments/Fail");
const ProfileCustomization_1 = __importDefault(require("./page/profile/cardcustom/ProfileCustomization"));
function App() {
    return (
    // 라이트 모드: bg-white, 다크 모드: bg-[#2B1D0E], 전체 화면 높이
    react_1.default.createElement("div", { className: "bg-white dark:bg-[#2B1D0E] min-h-screen transition-colors" },
        react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
            react_1.default.createElement(Header_1.default, null),
            react_1.default.createElement(MainContainer_1.default, null,
                react_1.default.createElement(react_router_dom_1.Routes, null,
                    react_1.default.createElement(react_router_dom_1.Route, { path: "/", element: react_1.default.createElement(ProfilePage_1.default, null) }),
                    react_1.default.createElement(react_router_dom_1.Route, { path: "/profile", element: react_1.default.createElement(ProfilePage_1.default, null) }),
                    react_1.default.createElement(react_router_dom_1.Route, { path: "/profile/cardcustom", element: react_1.default.createElement(ProfileCustomization_1.default, null) }),
                    react_1.default.createElement(react_router_dom_1.Route, { path: "/sandbox", element: react_1.default.createElement(Checkout_1.CheckoutPage, null) }),
                    " ",
                    react_1.default.createElement(react_router_dom_1.Route, { path: "/sandbox/success", element: react_1.default.createElement(Succeess_1.SuccessPage, null) }),
                    " ",
                    react_1.default.createElement(react_router_dom_1.Route, { path: "/sandbox/fail", element: react_1.default.createElement(Fail_1.FailPage, null) }),
                    " ")))));
}
exports.default = App;
