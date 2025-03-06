import React from "react";
import { Label, Input } from "./CustomStyle"; // 기존 스타일을 import

const ChangeSize = ({ label, name, value, min, max, step, onChange }) => {
  return (
    <div>
      <Label>{label}:</Label>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
      </div>
    </div>
  );
};

export default ChangeSize;
