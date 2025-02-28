import React, { useState } from "react";
import ChangeColor from "./ChangeColor";
import ChangeFont from "./ChangeFont";
import ChangeSize from "./ChangeSize";

const ProfileStyleCustomizer = ({ initialStyle, onChange }) => {
  const [customStyle, setCustomStyle] = useState(initialStyle);

  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    const newStyle = { ...customStyle, [name]: value };
    setCustomStyle(newStyle);
    onChange(newStyle);
  };

  return (
    <div>
      <h3>프로필 스타일 변경</h3>

      <ChangeColor
        label="배경색"
        name="bgColor"
        value={customStyle.bgColor}
        onChange={handleStyleChange}
      />

      <ChangeFont
        label="닉네임 폰트"
        name="nicknameFont"
        value={customStyle.nicknameFont}
        onChange={handleStyleChange}
      />

      <ChangeSize
        label="닉네임 크기"
        name="nicknameSize"
        value={customStyle.nicknameSize}
        min="1.0"
        max="2.9"
        step="0.1"
        onChange={handleStyleChange}
      />

      <ChangeFont
        label="소개 폰트"
        name="introduceFont"
        value={customStyle.introduceFont}
        onChange={handleStyleChange}
      />

      <ChangeSize
        label="소개 크기"
        name="introduceSize"
        value={customStyle.introduceSize}
        min="0.8"
        max="1.5"
        step="0.1"
        onChange={handleStyleChange}
      />
    </div>
  );
};

export default ProfileStyleCustomizer;
