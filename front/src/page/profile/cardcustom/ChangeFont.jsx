import React from "react";
import { Label, Select, ChangeWrapper } from "./CustomStyle";

const ChangeFont = ({ label, name, value, onChange }) => {
  return (
    <ChangeWrapper>
      <Label>{label}</Label>
      <Select name={name} value={value} onChange={onChange}>
        <option value="Arial, sans-serif">Arial</option>
        <option value="Courier New, monospace">Courier New</option>
        <option value="Georgia, serif">Georgia</option>
        <option value="Tahoma, sans-serif">Tahoma</option>
      </Select>
    </ChangeWrapper>
  );
};

export default ChangeFont;
