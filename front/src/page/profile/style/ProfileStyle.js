"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileCard = exports.UserStats = exports.Introduce = exports.Nickname = exports.ProfileInfo = exports.ProfileImagePlaceholder = exports.ProfileImage = exports.ProfileImageWrapper = exports.ProfileHeaderContainer = void 0;
const styled_components_1 = __importDefault(require("styled-components"));
exports.ProfileHeaderContainer = styled_components_1.default.section `
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;
exports.ProfileImageWrapper = styled_components_1.default.div `
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;
exports.ProfileImage = styled_components_1.default.img `
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
exports.ProfileImagePlaceholder = styled_components_1.default.div `
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: gray;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 0.9rem;
`;
exports.ProfileInfo = styled_components_1.default.div `
  flex: 1;
  @media (max-width: 768px) {
    text-align: left;
  }
`;
exports.Nickname = styled_components_1.default.h2 `
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;
exports.Introduce = styled_components_1.default.p `
  margin-top: 0;
  margin-bottom: 0.5rem;
`;
exports.UserStats = styled_components_1.default.div `
  margin-bottom: 0;

  span {
    margin-right: 1rem;
  }
  @media (max-width: 768px) {
    display: block; /* 세로로 나열되게 하기 */
    text-align: left; /* 텍스트 중앙 정렬 */
  }
`;
exports.ProfileCard = styled_components_1.default.div `
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: 0.3s ease;
  width: 100%;
  margin: 1rem;
`;
