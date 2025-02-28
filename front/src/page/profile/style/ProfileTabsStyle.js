"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPost = exports.CalendarSection = exports.TabContent = exports.TabItem = exports.TabList = exports.TabMenu = exports.ProfileTabsContainer = void 0;
const styled_components_1 = __importDefault(require("styled-components"));
exports.ProfileTabsContainer = styled_components_1.default.section `
  border-top: 1px solid #ddd;
  padding-top: 0;
`;
exports.TabMenu = styled_components_1.default.nav `
  margin-top: 0;
`;
exports.TabList = styled_components_1.default.ul `
  display: flex;
  justify-content: space-evenly;
  list-style: none;
  gap: 1rem;
  padding: 0;
  margin-bottom: 2rem;
  margin-top: 0px;

  @media (max-width: 768px) {
    flex-wrap: nowrap; /* 세로로 쌓이지 않게 설정 */
    width: 100%; /* 탭 리스트 너비를 100%로 설정 */
    overflow-x: auto; /* 필요시 가로 스크롤 가능하도록 설정 */
  }
`;
exports.TabItem = styled_components_1.default.li `
  padding: 0.5rem 1rem;
  border-bottom: 2px solid transparent;
  position: relative;
  cursor: pointer;

  &.active::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    border-top: 2px solid #000;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem; /* 모바일에서 텍스트 크기 조정 */
    padding: 0.2rem 0.3rem; /* 모바일에서 여백 줄이기 */
  }
`;
exports.TabContent = styled_components_1.default.div `
  align-items: center;
  justify-content: center;
`;
exports.CalendarSection = styled_components_1.default.div `
  margin: 30px auto;
  text-align: center;
  width: 90%;
  height: 400px;
  background-color: lightgray;
  border: 1px solid black;
`;
exports.UserPost = styled_components_1.default.article `
  border: 1px solid #eee;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
`;
