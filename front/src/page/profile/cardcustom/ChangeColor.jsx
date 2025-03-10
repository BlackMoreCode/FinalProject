import React from "react";
import { Label, ChangeWrapper } from "./CustomStyle";

const ChangeColor = ({ label, name, value, onChange }) => {
  return (
    <ChangeWrapper>
      <Label>{label}</Label>
      <input type="color" name={name} value={value} onChange={onChange} />
    </ChangeWrapper>
  );
};

export default ChangeColor;
