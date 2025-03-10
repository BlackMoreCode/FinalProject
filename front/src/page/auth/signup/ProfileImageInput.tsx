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
  border: 2px solid #ddd;
`;

const FileInputLabel = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;

const ProfileImageInput = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string); // 파일을 읽어서 미리보기
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ProfileWrapper>
      <ProfileImage>
        {selectedImage ? (
          <img src={selectedImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <CgProfile size={50} color="#ccc" />
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
