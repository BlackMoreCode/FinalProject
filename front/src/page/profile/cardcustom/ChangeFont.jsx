import React from "react";
import { Label, Select } from "./CustomStyle"; // 기존 스타일을 import

const ChangeFont = ({ label, name, value, onChange }) => {
  return (
    <div>
      <Label>{label}:</Label>
      <Select name={name} value={value} onChange={onChange}>
        <option value="Arial, sans-serif">Arial</option>
        <option value="Courier New, monospace">Courier New</option>
        <option value="Georgia, serif">Georgia</option>
        <option value="Tahoma, sans-serif">Tahoma</option>
      </Select>
    </div>
  );
};

export default ChangeFont;
