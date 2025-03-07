import React, { useState } from "react";
import ChangeColor from "./ChangeColor";
import ChangeFont from "./ChangeFont";
import ChangeSize from "./ChangeSize";
import {
  CustomizerContainer,
  SectionTitle,
  ChangeContainer,
  Label,
  Input,
  Select,
  Slider,
} from "./CustomStyle";

const ProfileStyleCustomizer = ({ initialStyle, onChange }) => {
  const [customStyle, setCustomStyle] = useState(initialStyle);

  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    const newStyle = { ...customStyle, [name]: value };
    setCustomStyle(newStyle);
    onChange(newStyle);
  };

  return (
    <CustomizerContainer>
      <SectionTitle>프로필 스타일 변경</SectionTitle>

      <ChangeContainer>
        <Label>배경색</Label>
        <ChangeColor
          name="bgColor"
          value={customStyle.bgColor}
          onChange={handleStyleChange}
        />
      </ChangeContainer>

      <ChangeContainer>
        <Label>닉네임 폰트</Label>
        <ChangeFont
          name="nicknameFont"
          value={customStyle.nicknameFont}
          onChange={handleStyleChange}
        />
      </ChangeContainer>

      <ChangeContainer>
        <Label>닉네임 크기</Label>
        <ChangeSize
          name="nicknameSize"
          value={customStyle.nicknameSize}
          min="1.0"
          max="2.9"
          step="0.1"
          onChange={handleStyleChange}
        />
      </ChangeContainer>

      <ChangeContainer>
        <Label>닉네임 글자색</Label>
        <ChangeColor
          name="textColorNickname"
          value={customStyle.textColorNickname}
          onChange={handleStyleChange}
        />
      </ChangeContainer>

      <ChangeContainer>
        <Label>소개 폰트</Label>
        <ChangeFont
          name="introduceFont"
          value={customStyle.introduceFont}
          onChange={handleStyleChange}
        />
      </ChangeContainer>

      <ChangeContainer>
        <Label>소개 크기</Label>
        <ChangeSize
          name="introduceSize"
          value={customStyle.introduceSize}
          min="0.8"
          max="1.5"
          step="0.1"
          onChange={handleStyleChange}
        />
      </ChangeContainer>

      <ChangeContainer>
        <Label>소개 글자색</Label>
        <ChangeColor
          name="textColorIntroduce"
          value={customStyle.textColorIntroduce}
          onChange={handleStyleChange}
        />
      </ChangeContainer>
    </CustomizerContainer>
  );
};

export default ProfileStyleCustomizer;
