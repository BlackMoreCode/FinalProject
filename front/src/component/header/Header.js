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
exports.default = Header;
const react_1 = __importStar(require("react"));
const HeaderStyle_1 = require("./style/HeaderStyle"); // 드롭다운 관련 컴포넌트 포함
const hi_1 = require("react-icons/hi");
// 상단 메뉴 리스트 (예시)
const menuList = [
    { path: "/", name: "Home" },
    { path: "/about", name: "About" },
    { path: "/contact", name: "Contact" },
];
function Header() {
    const [isMenuOpen, setMenuOpen] = (0, react_1.useState)(false);
    // 모바일 메뉴 열고 닫는 함수
    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };
    return (react_1.default.createElement(HeaderStyle_1.Navbar, null,
        react_1.default.createElement(HeaderStyle_1.NavContainer, null,
            react_1.default.createElement(HeaderStyle_1.TopSection, null,
                react_1.default.createElement("h1", null, "Logo"),
                react_1.default.createElement(HeaderStyle_1.LoginButton, null, "Login"),
                react_1.default.createElement(HeaderStyle_1.HamburgerIcon, { onClick: toggleMenu },
                    react_1.default.createElement(hi_1.HiMenu, null))),
            react_1.default.createElement(HeaderStyle_1.BottomSection, null,
                react_1.default.createElement(HeaderStyle_1.NavLinks, null,
                    menuList.map(({ path, name }) => (react_1.default.createElement(HeaderStyle_1.NavLink, { key: path, to: path, end: true }, name))),
                    react_1.default.createElement(HeaderStyle_1.DropdownContainer, null,
                        react_1.default.createElement(HeaderStyle_1.NavLink, { to: "#", className: "noUnderline" }, "Recipe"),
                        react_1.default.createElement(HeaderStyle_1.DropdownMenu, null,
                            react_1.default.createElement(HeaderStyle_1.DropdownItem, null,
                                react_1.default.createElement(HeaderStyle_1.NavLink, { to: "/food-recipe" }, "Food Recipe")),
                            react_1.default.createElement(HeaderStyle_1.DropdownItem, null,
                                react_1.default.createElement(HeaderStyle_1.NavLink, { to: "/cocktail-recipe" }, "Cocktail Recipe")))))),
            react_1.default.createElement(HeaderStyle_1.MobileMenu, { isMenuOpen: isMenuOpen },
                react_1.default.createElement(HeaderStyle_1.MenuItem, null,
                    react_1.default.createElement(HeaderStyle_1.MobileLoginButton, null, "Login")),
                menuList.map(({ path, name }) => (react_1.default.createElement(HeaderStyle_1.MenuItem, { key: path },
                    react_1.default.createElement(HeaderStyle_1.NavLink, { to: path, end: true }, name)))),
                react_1.default.createElement(HeaderStyle_1.MenuItem, null,
                    react_1.default.createElement(HeaderStyle_1.NavLink, { to: "#" }, "Recipe"),
                    react_1.default.createElement(HeaderStyle_1.MenuItem, null,
                        react_1.default.createElement(HeaderStyle_1.NavLink, { to: "/food-recipe" }, "Food Recipe")),
                    react_1.default.createElement(HeaderStyle_1.MenuItem, null,
                        react_1.default.createElement(HeaderStyle_1.NavLink, { to: "/cocktail-recipe" }, "Cocktail Recipe")))))));
}
