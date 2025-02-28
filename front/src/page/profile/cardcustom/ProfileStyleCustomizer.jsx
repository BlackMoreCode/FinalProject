import React, { useState } from "react";

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
      <label>
        배경색:
        <input
          type="color"
          name="bgColor"
          value={customStyle.bgColor}
          onChange={handleStyleChange}
        />
      </label>
      <br />
      <label>
        닉네임 폰트:
        <select
          name="nicknameFont"
          value={customStyle.nicknameFont}
          onChange={handleStyleChange}
        >
          <option value="Arial, sans-serif">Arial</option>
          <option value="Courier New, monospace">Courier New</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Tahoma, sans-serif">Tahoma</option>
        </select>
      </label>
      <label>
        닉네임 크기:
        <input
          type="range"
          name="nicknameSize"
          min="1.0"
          max="2.9"
          step="0.1"
          value={parseFloat(customStyle.nicknameSize)}
          onChange={(e) =>
            handleStyleChange({
              target: { name: "nicknameSize", value: `${e.target.value}rem` },
            })
          }
        />
        <input
          type="number"
          value={parseFloat(customStyle.nicknameSize)}
          readOnly
        />
      </label>
      <br />
      <label>
        소개 폰트:
        <select
          name="introduceFont"
          value={customStyle.introduceFont}
          onChange={handleStyleChange}
        >
          <option value="Arial, sans-serif">Arial</option>
          <option value="Courier New, monospace">Courier New</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Tahoma, sans-serif">Tahoma</option>
        </select>
      </label>
      <label>
        소개 크기:
        <input
          type="range"
          name="introduceSize"
          min="0.8"
          max="1.5"
          step="0.1"
          value={parseFloat(customStyle.introduceSize)}
          onChange={(e) =>
            handleStyleChange({
              target: { name: "introduceSize", value: `${e.target.value}rem` },
            })
          }
        />
        <input
          type="number"
          value={parseFloat(customStyle.introduceSize)}
          readOnly
        />
      </label>
    </div>
  );
};

export default ProfileStyleCustomizer;
