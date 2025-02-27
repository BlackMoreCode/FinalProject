import { useRecoilState, useRecoilValue } from "recoil";
import { passwordState } from "../../../context/recoil/AuthState";
import { isPasswordMatchState } from "../../../context/recoil/Selector";
import { Input, InputContainer, Message } from '../Style';
import React, { useEffect } from "react";


type MatchInputProps = {
  setter: (value : string, type: string) => void;  // setter prop 추가
};

const MatchInput = ({ setter }: MatchInputProps) => {
  const [info, setInfo] = useRecoilState(passwordState);
  const pwdValid = useRecoilValue(isPasswordMatchState);

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo((prev) => ({ ...prev, value: e.target.value }));
  };

  const onChangePwdConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo((prev) => ({ ...prev, confirmValue: e.target.value }));
  };

  useEffect(() => {
    setInfo((prev) => ({ ...prev, pwdValid }));
  }, [pwdValid]);

  useEffect(() => {
    // setter를 통해 info.isValidFormat && !info.isDuplicate인 경우 value를 넘긴다
    setter(info.isValidFormat && info.isDuplicate ? info.value : "", "비밀번호");
  }, [pwdValid]);

  return (
    <>
      <InputContainer>
        <p>비밀번호</p>
        <Input type="password" placeholder="비밀번호를 입력해 주세요" value={info.value} onChange={onChangePassword} />
        {info.message && <Message isValid={info.isValidFormat}>{info.message}</Message>}
      </InputContainer>
      <InputContainer>
        <p>비밀번호 확인</p>
        <Input type="password" placeholder="비밀번호를 다시 입력해 주세요" value={info.confirmValue} onChange={onChangePwdConfirm} disabled={!info.isValidFormat} />
        {info.isValidFormat && info.message && <Message isValid={info.isDuplicate}>{info.message}</Message>}
      </InputContainer>
    </>
  );
};

export default MatchInput;
