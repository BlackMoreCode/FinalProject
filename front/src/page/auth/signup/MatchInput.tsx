import React, { useState, useEffect, useCallback } from "react";
import { Input, InputContainer, Message } from "../Style";

type MatchInputProps = {
  setter: (value: string, type: string) => void;
};

const MatchInput = ({ setter }: MatchInputProps) => {
  const [value, setValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");
  const [isValidFormat, setIsValidFormat] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onChangePwdConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmValue(e.target.value);
  };

  // 비밀번호 형식 및 일치 여부 체크
  const validatePassword = useCallback(() => {
    if (!value) {
      return;
    }

    const isFormatValid = passwordRegex.test(value);

    if(isFormatValid) {
      const isMatch = value === confirmValue;
      setIsDuplicate(isMatch);
      if (isMatch) {
        setConfirmMessage("비밀번호와 일치합니다.");
      } else {
        setConfirmMessage("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      }
    }

    setIsValidFormat(isFormatValid);

    if (!isFormatValid) {
      setMessage("비밀번호 형식이 올바르지 않습니다.");
    } else {
      setMessage("비밀번호 형식이 올바릅니다.");
    }

  }, [value, confirmValue]);

  useEffect(() => {
    validatePassword();
  }, [value, confirmValue, validatePassword]);

  const handleSetter = useCallback(() => {
    if (isValidFormat && isDuplicate && value !== "") {
      setter(value, "password");
    }
  }, [isValidFormat, isDuplicate, value, setter]);

  useEffect(() => {
    handleSetter();
  }, [handleSetter]);

  return (
    <>
      <InputContainer>
        <p>비밀번호</p>
        <Input
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          value={value}
          onChange={onChangePassword}
        />
        {message && <Message isValid={isValidFormat}>{message}</Message>}
      </InputContainer>
      <InputContainer>
        <p>비밀번호 확인</p>
        <Input
          type="password"
          placeholder="비밀번호를 다시 입력해 주세요"
          value={confirmValue}
          onChange={onChangePwdConfirm}
          disabled={!isValidFormat}
        />
        {isValidFormat && message && (
          <Message isValid={isDuplicate}>{confirmMessage}</Message>
        )}
      </InputContainer>
    </>
  );
};

export default MatchInput;
