import React, {useEffect, useState} from "react";
import styled from "styled-components";
import AuthApi from "../../../api/AuthApi";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../context/Store";
import {Dialog, DialogTitle} from "@mui/material";
import {ChangeWithSetter} from "../../../context/types";
import {closeModal, setRejectModal} from "../../../context/redux/ModalReducer";

const PasswordModal = ({open, onClose} : {open: boolean, onClose: () => void}) => {
  const findPw = useSelector((state : RootState) => state.modal.findPwModal)
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if(!findPw) onClose()
  }, [findPw]);

  const handleInputChange : ChangeWithSetter<string> = (e, setState) => {
    setState(e.target.value);
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      dispatch(setRejectModal({message: "비밀번호와 비밀번호 확인이 다릅니다.", onCancel: null}))
      return;
    }
    try {
      const response = await AuthApi.changePassword(newPassword); // 비밀번호 변경 API 호출
      if (response) {
        dispatch(setRejectModal({message: "비밀번호가 성공적으로 바뀌었습니다.", onCancel: null}))
        setTimeout(() => {
          dispatch(closeModal("findPw"))
        }, 2000);
      } else {
        dispatch(setRejectModal({message: "비밀번호 변경에 실패했습니다.", onCancel: null}))
      }
    } catch (e) {
      console.error("오류 발생:", e);
      dispatch(setRejectModal({message: "서버가 응답하지 않습니다.", onCancel: null}))
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>비밀번호 변경</DialogTitle>
      <InputContainer>
        <label>새 비밀번호</label>
        <StyledInput
            type="password"
            value={newPassword}
            onChange={(e) => handleInputChange(e, setNewPassword)}
            placeholder="새 비밀번호를 입력하세요"
        />
      </InputContainer>
      <InputContainer>
        <label>비밀번호 확인</label>
        <StyledInput
            type="password"
            value={confirmPassword}
            onChange={(e) => handleInputChange(e, setConfirmPassword)}
            placeholder="비밀번호를 확인하세요"
        />
      </InputContainer>
      <ButtonContainer>
        <StyledButton onClick={handlePasswordReset}>비밀번호 변경</StyledButton>
        <CancelButton onClick={() => dispatch((closeModal("findPw")))}>취소</CancelButton>
      </ButtonContainer>
    </Dialog>
  );
};

export default PasswordModal;


const InputContainer = styled.div`
  margin-bottom: 15px;
  text-align: left;

  label {
    display: block;
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #a16eff;
    outline: none;
    box-shadow: 0 0 4px rgba(161, 110, 255, 0.5);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const StyledButton = styled.button`
  background: #a16eff;
  color: white;
  border: none;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  flex: 1;
  margin-right: 5px;
  transition: background 0.3s;

  &:hover {
    background: #dccafc;
  }
`;

const CancelButton = styled(StyledButton)`
  background:  #dccafc;
  color: white;

  &:hover {
    background:  #a16eff;
  }
`;
