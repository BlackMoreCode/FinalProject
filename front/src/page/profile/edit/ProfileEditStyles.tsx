import styled from "styled-components";
import { FiUpload } from "react-icons/fi";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const ProfileImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ddd;
`;

export const UploadButton = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const UploadIcon = styled(FiUpload)`
  font-size: 20px;
`;

// 🔹 추가된 스타일
export const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  margin-top: 10px;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

export const Button = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #0056b3;
  }
`;

export const ProfileImagePlaceholder = styled.div`
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
