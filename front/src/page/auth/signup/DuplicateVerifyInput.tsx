import React, { useState, useEffect, useCallback } from "react";
import { Input, InputContainer, Message } from "../Style";
import AuthApi from "../../../api/AuthApi";

// props 타입 정의
interface DuplicateVerifyInputProps {
  type?: string;
  label: string;
  id: string;
  setter: (value: string, type: string) => void;
}

const DuplicateVerifyInput = ({
                                type = "text",
                                label,
                                setter,
                                id,
                              }: DuplicateVerifyInputProps) => {
  const [value, setValue] = useState("");
  const [isValidFormat, setIsValidFormat] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [message, setMessage] = useState("");

  // 유효성 검사 정규식 (이메일 / 전화번호 / 닉네임)
  const regex = useCallback(() => {
    switch (label) {
      case "이메일":
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      case "전화번호":
        return /^\d{10,11}$/;
      case "닉네임":
        return /^[a-zA-Z0-9가-힣]{2,16}$/;
      default:
        return null;
    }
  }, [label]);

  // 입력 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // 검증 함수
  const validateInput = useCallback(async () => {
    if (!value) {
      setIsValidFormat(false);
      setMessage("");
      setIsDuplicate(false);
      return;
    }

    if (!regex()?.test(value)) {
      setIsValidFormat(false);
      setMessage(`${label}의 형식이 올바르지 않습니다.`);
      setIsDuplicate(false);
      return;
    }

    try {
      const rsp =
        label === "이메일"
          ? await AuthApi.emailExists(value)
          : label === "전화번호"
            ? await AuthApi.phoneExists(value)
            : label === "닉네임"
              ? await AuthApi.nicknameExists(value)
              : null;

      if (!rsp?.data) {
        setIsValidFormat(true);
        setIsDuplicate(false);
        setMessage(`${label} 사용 가능합니다.`);
      } else {
        setIsValidFormat(true);
        setIsDuplicate(true);
        setMessage(`${label}는 중복된 값입니다.`);
      }
    } catch (error) {
      console.error(error);
      setIsValidFormat(false);
      setIsDuplicate(false);
      setMessage("확인 중 오류 발생.");
    }
  }, [value, label, regex]);

  // 값이 변경될 때마다 자동으로 검증 실행
  useEffect(() => {
    validateInput();
  }, [value, validateInput]);

  // 유효성 검사 결과가 변경될 때 setter 호출
  useEffect(() => {
    if (isValidFormat && !isDuplicate) {
      setter(value, id);
    } else {
      setter("", id); // 유효하지 않거나 중복되면 빈 값 전달
    }
  }, [isValidFormat, isDuplicate, value, setter, label]);

  return (
    <InputContainer>
      <p>{label}</p>
      <Input
        type={type}
        placeholder={`${label}을 입력해 주세요`}
        value={value}
        onChange={handleChange}
      />
      {message && (
        <Message isValid={isValidFormat && !isDuplicate}>{message}</Message>
      )}
    </InputContainer>
  );
};

export default DuplicateVerifyInput;
