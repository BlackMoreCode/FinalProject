import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileStyleCustomizer from "./ProfileStyleCustomizer";
import Profile from "../Profile";

const ProfileCustomization = () => {
  const navigate = useNavigate();

  const [user] = useState({
    name: "홍길동",
    introduce: "동에 번쩍 서에 번쩍",
    profileImg: "",
    postsCount: 12,
    likesCount: 25,
  });

  const [customStyle, setCustomStyle] = useState({
    bgColor: "#ffffff",
    nicknameFont: "Arial, sans-serif",
    nicknameSize: "1.5rem",
    introduceFont: "Georgia, serif",
    introduceSize: "1rem",
  });

  const handleSave = () => {
    // 여기에서 저장 로직을 추가할 수 있음 (ex. localStorage, API 요청)
    navigate("/profile");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
      <h2>프로필 스타일 커스터마이징</h2>
      <Profile user={user} customStyle={customStyle} />
      <ProfileStyleCustomizer
        initialStyle={customStyle}
        onChange={setCustomStyle}
      />
      <button onClick={handleSave}>저장 후 돌아가기</button>
    </div>
  );
};

export default ProfileCustomization;
