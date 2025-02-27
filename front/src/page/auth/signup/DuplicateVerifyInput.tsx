import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {FC, useEffect} from "react";
import React from "react";
import {Input, InputContainer, Message} from "../Style";
import { RecoilState, RecoilValueReadOnly } from "recoil";
import {validationSelectorFamily} from "../../../context/recoil/Selector";

// Recoil 상태 객체 타입
interface ValidationState {
  value: string;
  isValidFormat: boolean;
  isDuplicate: boolean;
  message: string;
}

// props 타입 정의
interface DuplicateVerifyInputProps {
  state: RecoilState<ValidationState>; // Recoil 상태 (예: emailState)
  type?: string;
  setter: (value: string, type: string) => void;
  label: string;
}



const DuplicateVerifyInput = ({
                                state,
                                type = "text",
                                label,
                                setter,
                              }: DuplicateVerifyInputProps) => {
  const [info, setInfo] = useRecoilState(state);
  const validationResult = useRecoilValue<ValidationState>(validationSelectorFamily(state));

  // 입력 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo((prev) => ({ ...prev, value: e.target.value }));
  };

  // 값이 변경될 때마다 자동으로 검증 실행
  useEffect(() => {
    setInfo(validationResult)
  }, [validationResult]);

  useEffect(() => {
    setter((info.isValidFormat && !info.isDuplicate) ? info.value : "", label )
  }, [validationResult]);

  return (
    <InputContainer>
      <p>{label}</p>
      <Input type={type} placeholder={`${label}을 입력해 주세요`} value={info.value} onChange={handleChange} />
      {info.message && <Message isValid={info.isValidFormat && !info.isDuplicate}>{info.message}</Message>}
    </InputContainer>
  );
};

export default DuplicateVerifyInput;
