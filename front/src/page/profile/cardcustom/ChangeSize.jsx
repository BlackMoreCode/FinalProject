import React from "react";
import { Label, Input, ChangeWrapper } from "./CustomStyle"; // 기존 스타일을 import

const ChangeSize = ({ label, name, value, min, max, step, onChange }) => {
  return (
    <ChangeWrapper>
      <Label>{label}</Label>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={parseFloat(value)}
        onChange={(e) =>
          onChange({ target: { name, value: `${e.target.value}rem` } })
        }
      />
      <Input type="number" value={parseFloat(value)} readOnly />
    </ChangeWrapper>
  );
};
export default ChangeSize;
