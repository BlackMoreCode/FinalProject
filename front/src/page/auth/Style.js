"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsCheckbox = exports.CloseButton = exports.TermLink = exports.TermLabel = exports.TermContainer = exports.TermsHeader = exports.TermsWrapper = exports.SignupButton = exports.ButtonContainer = exports.Message = exports.PhoneVerifyButton = exports.Input = exports.InputContainer = exports.ModalContainer = exports.FileInput = exports.FileInputLabel = exports.ProfileImage = exports.ProfileWrapper = exports.SnsLoginText = exports.Line = exports.SignupTextButton = exports.Slash = exports.TextButton = exports.TextButtonContainer = exports.Button = exports.InputField = exports.ModalContent = exports.LogoImg = exports.GoogleButton = exports.KakaoButton = exports.NaverButton = exports.SocialButtonsContainer = void 0;
const styled_components_1 = __importDefault(require("styled-components"));
exports.SocialButtonsContainer = styled_components_1.default.div `
  display: flex;
  flex-direction: column;
  gap: 10px; // 버튼 간 간격
`;
exports.NaverButton = styled_components_1.default.button `
  width: 100%;
  height: 45px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;
  background-color: #03c75a;    // 네이버에서 스포이드로 가져옴
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  > p {
    font-size: 16px;
    color: #FFF;
  }
`;
exports.KakaoButton = styled_components_1.default.button `
  width: 100%;
  height: 45px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;
  background-color: #fee500;    // 카카오에서 스포이드로 가져옴
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  > p {
    font-size: 16px;
    color: #3e2723; // 카카오 로고에서 스포이드로 가져옴
  }
`;
exports.GoogleButton = styled_components_1.default.button `
  width: 100%;
  height: 45px;
  border: 1px solid black;  // 테두리 검은색 설정
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;
  background-color: white;  // 카카오에서 스포이드로 가져옴
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  > p {
    font-size: 16px;
    color: black;  // 카카오 로고에서 스포이드로 가져옴
  }
`;
exports.LogoImg = styled_components_1.default.img `
  width: 25px;
  cursor: pointer;
`;
// 모달 콘텐츠
exports.ModalContent = styled_components_1.default.div `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  z-index: 9999;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 600px; // 높이 조정
`;
// 입력 필드 스타일
exports.InputField = styled_components_1.default.input `
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #dccafc;
  border-radius: 20px;
  box-sizing: border-box;
  font-size: 16px;
  
  
  &:focus {
    border-color: #a16eff; /* 클릭 시 변경할 테두리 색상 */
    outline: none; /* 기본 파란색 아웃라인 제거 */
    box-shadow: 0 0 5px rgba(161, 110, 255, 0.5); /* 클릭 시 부드러운 그림자 효과 */
  }
`;
// 버튼 스타일
exports.Button = styled_components_1.default.button `
  width: 100%;
  padding: 12px;
  background-color: #5f53d3;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); // 쉐도우 추가
  
  &:hover {
    background-color: #dccafc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // Hover 시 쉐도우 강조
  }
`;
// 텍스트 버튼 스타일
exports.TextButtonContainer = styled_components_1.default.div `
  margin-top: 25px;
  display: flex;
  justify-content: space-between; /* Spread the buttons */
  align-items: center;
  width: 100%;
`;
exports.TextButton = styled_components_1.default.button `
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  font-size: 12px; // Reduced font size
  text-decoration: underline;
  margin-right: 8px; // Space between 아이디 찾기 and 비밀번호 찾기
  
  &:hover {
    color: #c1c1c1;
  }
`;
exports.Slash = styled_components_1.default.span `
  margin-right: 8px;
  color: black;
  font-size: 12px; // Reduced font size
`;
exports.SignupTextButton = styled_components_1.default.button `
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  font-size: 12px; // Reduced font size
  text-decoration: underline;
  
  &:hover {
    color: #c1c1c1;
  }
`;
exports.Line = styled_components_1.default.div `
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
`;
exports.SnsLoginText = styled_components_1.default.div `
  font-size: 14px;
  color: black;
  margin-bottom: 10px;
`;
exports.ProfileWrapper = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  margin: 30px 0 20px 0;
`;
exports.ProfileImage = styled_components_1.default.div `
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    font-size: 18px;
  }
`;
exports.FileInputLabel = styled_components_1.default.label `
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 5px;
  cursor: pointer;
  border-radius: 50%;
`;
exports.FileInput = styled_components_1.default.input `
  display: none;
`;
exports.ModalContainer = styled_components_1.default.div `
  border-radius: 25px;
  z-index: 1000;
  background-color: ${({ theme }) => theme.background || "white"};
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
 
`;
exports.InputContainer = styled_components_1.default.div `
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
exports.Input = styled_components_1.default.input `
  padding: 9px;
  margin-bottom: 2px;
  border: 1px solid ${({ theme }) => theme.border || "#dccafc"};
  border-radius: 15px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.inputBackground || "white"};
  color: ${({ theme }) => theme.inputTextColor || "black"};
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); // 쉐도우 추가
  &:focus {
    border-color: #a16eff; /* 클릭 시 변경할 테두리 색상 */
    outline: none; /* 기본 파란색 아웃라인 제거 */
    box-shadow: 0 0 5px rgba(161, 110, 255, 0.5); /* 클릭 시 부드러운 그림자 효과 */
  }
  &::placeholder {
    font-size: 12px;  /* placeholder 텍스트 크기 줄이기 */
    color: ${({ theme }) => theme.placeholderColor || "#aaa"};  /* placeholder 텍스트 색상 */
  }
`;
exports.PhoneVerifyButton = styled_components_1.default.button `
  padding: 9px;
  font-size: 16px;
  color: ${({ theme }) => theme.buttonTextColor || "white"};
  background-color: ${({ disabled, theme }) => (disabled ? theme.disabledButton || "#dccafc" : theme.buttonBackground || "#5f53d3")};
  border: none;
  border-radius: 20px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  &:hover {
    background-color: ${({ disabled, theme }) => (disabled ? theme.disabledButtonHover || "#dccafc" : theme.buttonHover || "#5f53d3")};
  }
`;
exports.Message = styled_components_1.default.p `
  color: ${(props) => (props.isValid ? (props.theme.validMessage || 'green') : (props.theme.invalidMessage || 'red'))}; /* 메시지 색상 */
  text-align: right;
  font-size: 13px;
`;
exports.ButtonContainer = styled_components_1.default.div `
  display: flex;
  justify-content: center;
   margin-top: 30px; // 가입하기 버튼과 약관 동의 사이의 간격을 넓힘
`;
exports.SignupButton = styled_components_1.default.button `
  padding: 15px 30px;
  font-size: 16px;
  color: ${({ theme }) => theme.buttonTextColor || "white"};
  background-color: ${({ disabled, theme }) => (disabled ? theme.disabledButton || "#5f53d3" : theme.buttonBackground || "#dccafc")};
  border: none;
  border-radius: 20px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  &:hover {
    background-color: ${({ disabled, theme }) => (disabled ? theme.disabledButtonHover || "#5f53d3" : theme.buttonHover || "#dccafc")};
  }
`;
exports.TermsWrapper = styled_components_1.default.div `
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #5f53d3;
  border-radius: 15px;
  text-align: left; // 왼쪽 정렬
`;
exports.TermsHeader = styled_components_1.default.h4 `
  color: #5f53d3;
  text-align: left; // 왼쪽 정렬
`;
exports.TermContainer = styled_components_1.default.div `
  display: flex;
  align-items: center; /* 체크박스와 텍스트 세로 중앙 정렬 */
  margin-bottom: 6px;
  gap: 8px; /* 체크박스와 텍스트 사이의 간격 */
`;
exports.TermLabel = styled_components_1.default.label `
  color: #333;
  font-size: 14px;
  margin-left: 8px; /* 텍스트와 체크박스 사이의 간격 */
`;
exports.TermLink = styled_components_1.default.span `
  color: blue;
  cursor: pointer;
  text-decoration: underline;
`;
exports.CloseButton = styled_components_1.default.button `
  padding: 10px 20px;
  background-color: #5f53d3;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;
exports.TermsCheckbox = styled_components_1.default.input `
  appearance: none; /* 기본 브라우저 스타일 제거 */
  width: 16px;
  height: 16px;
  border: 2px solid #5f53d3; /* 체크박스 테두리 */
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  
  &:checked {
    background-color: #5f53d3; /* 체크되었을 때 배경색 */
    border-color: #5f53d3;
  }

  &:checked::before {
    content: "✔"; /* 체크 표시 */
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: white; /* 체크 표시 색 */
    font-size: 12px;
    font-weight: bold;
  }
`;
const TermsContainer = styled_components_1.default.div `
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 10px;
  border: 1px solid #5f53d3;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.inputBackground || "white"};
`;
