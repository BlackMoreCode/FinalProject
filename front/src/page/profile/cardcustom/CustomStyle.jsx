import styled from "styled-components";

export const CustomizerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  width: 100%;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

export const ChangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

export const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: #555;
`;

export const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-top: 5px;
`;

export const Select = styled.select`
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  margin-top: 5px;
`;

// 전체 레이아웃 스타일
export const CustomizationPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  min-height: 100vh;
  width: 100%;
`;

// 프로필 스타일 커스터마이징 제목
export const CustomizationPageTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  text-align: center;
`;

// 저장 버튼 스타일
export const SaveButton = styled.button`
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  background-color: #b97148;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e78b40;
  }
`;

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

export const ChangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
