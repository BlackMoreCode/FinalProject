"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownItem = exports.DropdownMenu = exports.DropdownContainer = exports.MenuItem = exports.MobileLoginButton = exports.MobileMenu = exports.HamburgerIcon = exports.LoginButton = exports.NavLink = exports.NavLinks = exports.BottomSection = exports.TopSection = exports.NavContainer = exports.Navbar = void 0;
const styled_components_1 = __importDefault(require("styled-components"));
const react_router_dom_1 = require("react-router-dom");
// 네비게이션 전체 래퍼
exports.Navbar = styled_components_1.default.nav `
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid #dfd3c3;
  /* background-color: #fff; */
  position: relative;
  z-index: 10;
  /* overflow-x: hidden;
  overflow-y: visible; */
  overflow: visible; // 부모 요소가 드롭다운을 잘라내지 않도록 overflow를 visible로 설정

  @media (max-width: 768px) {
    background-color: #d1b6a3;
    border-bottom: 1px solid #6a4e23;
    height: 72px;
    position: fixed;
  }
`;
// 네비게이션 내부 컨테이너
exports.NavContainer = styled_components_1.default.div `
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem; /* 기존 2rem에서 줄여서 여백 문제 해결 */
  display: flex;
  flex-direction: column;
  overflow-x: visible;

  @media (max-width: 768px) {
    padding: 0 0.5rem; /* 좁은 화면에서 패딩을 줄여서 너비 확보 */
  }
`;
// 상단 섹션 (로고, 로그인, 햄버거)
exports.TopSection = styled_components_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: #6a4e23;
  overflow: hidden;
  position: relative;
`;
// 하단 섹션 (PC 뷰용 메뉴)
exports.BottomSection = styled_components_1.default.div `
  display: flex;
  justify-content: flex-start;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    display: none; /* 모바일에서 숨기기 */
  }
`;
// PC 뷰용 메뉴 리스트 (ul)
exports.NavLinks = styled_components_1.default.ul `
  list-style: none;
  display: flex;
  gap: 3rem;
  color: #9f8473;
  padding-left: 0;
  font-weight: bold;
  position: relative;
  width: 100%;

  @media (max-width: 768px) {
    display: none; /* 모바일에서 네비 메뉴 숨기기 */
  }
`;
// 공통 링크 스타일 (NavLink)
exports.NavLink = (0, styled_components_1.default)(react_router_dom_1.NavLink) `
  text-decoration: none;
  color: #9f8473;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  padding-bottom: 5px;

  &:hover {
    color: #d1b6a3;
  }

  &.active::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -15px; /* 네비 바 하단 보더와 겹치도록 조정 */
    width: 100%;
    height: 3px;
    background-color: #6a4e23;
    transition: left 0.3s ease, width 0.3s ease; /* 밑줄 이동 애니메이션 */
  }

  @media (max-width: 768px) {
    color: #6a4e23;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    padding-bottom: 5px;
    width: 100%;

    &:hover {
      color: #fff;
    }

    &.active::after,
    &.active::before {
      content: "";
      position: absolute;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: #6a4e23;
      opacity: 0; /* 초기 상태에서는 숨김 */
      transform: scaleX(0); /* 처음에는 크기가 0으로 설정 */
      transition: opacity 0.3s ease, transform 0.3s ease; /* 애니메이션을 부드럽게 */
      z-index: 1; /* 두 선이 겹치지 않도록 z-index 추가 */
    }

    &.active::after {
      bottom: -5px; /* 아래쪽 선 */
    }

    &.active::before {
      top: -5px; /* 위쪽 선 */
    }

    &.active::after,
    &.active::before {
      opacity: 1; /* 활성화되면 선이 나타남 */
      transform: scaleX(1); /* 애니메이션으로 확장 */
    }
  }
`;
// 로그인 버튼
exports.LoginButton = styled_components_1.default.button `
  background: none;
  border: 1px solid #6a4e23;
  color: #6a4e23;
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background: #6a4e23;
    color: #f5f5dc;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;
// 햄버거 아이콘
exports.HamburgerIcon = styled_components_1.default.div `
  display: none;
  font-size: 30px;
  cursor: pointer;
  color: #6a4e23;
  position: absolute;
  right: 2rem; /* 기존과 동일하지만 공백 문제 방지 */
  top: 50%;
  transform: translateY(-50%);

  @media (max-width: 768px) {
    display: block;
  }
`;
// 모바일 메뉴 (햄버거 클릭 시 표시)
exports.MobileMenu = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border: 1px solid #6a4e23;
  border-top: none;
  width: 45%;
  position: fixed;
  top: 72px;
  right: 0;
  z-index: 1000;
  padding: 2rem 0;
  padding-top: 0;
  box-shadow: -2px 4px 8px rgba(0, 0, 0, 0.2);
  gap: 2rem;
  transform: translateX(120%); /* 처음엔 화면 밖 */
  transition: transform 0.3s ease-in-out; /* 애니메이션 */

  ${({ isMenuOpen }) => isMenuOpen && `transform: translateX(0);`}
`;
// 모바일 메뉴용 로그인 버튼
exports.MobileLoginButton = styled_components_1.default.button `
  background: none;
  border: 1px solid #6a4e23;
  color: #6a4e23;
  padding: 1rem 1rem;
  cursor: pointer;
  width: 100%;
  text-align: center;
  border-left: none;
  border-right: none;

  &:hover {
    background: #6a4e23;
    color: #f5f5dc;
  }
`;
// 모바일 메뉴 아이템
exports.MenuItem = styled_components_1.default.div `
  width: 100%;
  text-align: center;

  ${exports.NavLink} {
    color: #6a4e23;
  }
`;
/* ---------------------------------------
   드롭다운 관련 스타일
   PC 뷰에서 "Recipe" 메뉴에 마우스 올렸을 때
   서브 메뉴가 보이는 형태
---------------------------------------- */
// 드롭다운을 감싸는 컨테이너
exports.DropdownContainer = styled_components_1.default.div `
  position: relative; /* 서브 메뉴 위치 조절을 위한 relative */
  display: inline-block;

  // 마우스 오버 시 내부의 ul 표시
  &:hover > ul {
    display: block;
  }

  // .noUnderline가 active일 때도 밑줄 제거
  .noUnderline.active::after,
  .noUnderline.active::before {
    content: none !important;
  }
`;
// 드롭다운 메뉴 (서브 메뉴 ul)
exports.DropdownMenu = styled_components_1.default.ul `
  display: none;
  position: absolute;
  top: 2rem; /* 부모 메뉴 아래에 표시 */
  left: 0;
  list-style: none;
  margin: 0;
  padding: 0.5rem 1rem;
  background-color: #fff;
  border: 1px solid #6a4e23;
  z-index: 9999;
`;
// 드롭다운 메뉴 아이템 (li)
exports.DropdownItem = styled_components_1.default.li `
  margin: 0.5rem 0;

  ${exports.NavLink} {
    color: #6a4e23;
    text-decoration: none;
    font-weight: normal;

    // 드롭다운 내의 active 상태에서 나타나는 밑줄/바를 제거
    &.active::after,
    &.active::before {
      content: none !important;
    }

    &:hover {
      color: #d1b6a3;
    }
  }
`;
