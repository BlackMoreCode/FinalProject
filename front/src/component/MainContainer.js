"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styled_components_1 = __importDefault(require("styled-components"));
const MainContainer = styled_components_1.default.main `
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  /* 원하는 배경색으로 변경 가능 */
  /* background-color: white;  */

  @media (max-width: 768px) {
    top: 72px;
    position: relative;
  }
`;
exports.default = MainContainer;
