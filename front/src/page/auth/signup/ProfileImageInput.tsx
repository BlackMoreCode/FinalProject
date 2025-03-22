import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import styled from "styled-components";

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileImage = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FileInputLabel = styled.label`
  position: absolute;
  bottom: 5px; /* 이미지 영역 내에서 버튼이 5px 정도 떨어지게 */
  right: 5px;  /* 이미지의 오른쪽 하단에 위치하도록 */
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10; /* 버튼이 이미지 위로 오도록 설정 */
  box-sizing: border-box; /* 크기 계산에 padding, border를 포함하도록 설정 */
`;

const FileInput = styled.input`
  display: none;
`;

interface ProfileImageInputProps {
  onFileChange: (file: File | null) => void;
}

const ProfileImageInput: React.FC<ProfileImageInputProps> = ({ onFileChange }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string); // 파일을 읽어서 미리보기
      };
      reader.readAsDataURL(file);
      onFileChange(file); // 부모 컴포넌트로 파일 전달
    } else {
      onFileChange(null); // 파일 선택이 취소된 경우 null 전달
    }
  };

  return (
    <ProfileWrapper>
      <ProfileImage>
        {selectedImage ? (
          <img src={selectedImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <CgProfile size={140} color="#6a4e23" />
        )}
        <FileInputLabel htmlFor="profileImage">
          +
          <FileInput
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleFileInputChange}
          />
        </FileInputLabel>
      </ProfileImage>
    </ProfileWrapper>
  );
};

export default ProfileImageInput;
  