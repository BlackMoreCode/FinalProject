import { Dialog, DialogContent, DialogActions, Typography, Button } from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../context/Store";
import React from "react";
import styled from "styled-components";
import {closeConfirmModal, openModal} from "../../context/redux/ModalReducer";


const ConfirmModal = () => {
  // Redux 상태에 대한 타입 지정
  const confirm = useSelector((state: RootState) => state.modal.confirmModal);
  const dispatcher = useDispatch<AppDispatch>()
  const onCancel = () => {
    confirm.onCancel?.()
    dispatcher(closeConfirmModal())
  }
  const onConfirm = () => {
    confirm.onConfirm?.()
    if(confirm.message === "로그아웃 되었습니다. \n 다시 로그인 하시겠습니까?") dispatcher(openModal("login"))
    dispatcher(closeConfirmModal())
  }
  return (
    <Dialog open={confirm.open} onClose={onCancel} maxWidth="xs" fullWidth>
      <CustomDialogContent>
        <Typography variant="h6" gutterBottom>
          {confirm.message &&
            confirm.message.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
        </Typography>
      </CustomDialogContent>
      <DialogActions>
        <StyledButton variant="contained" color="primary" onClick={onConfirm}>
          확인
        </StyledButton>
        <StyledButton variant="outlined" color="error" onClick={onCancel}>
          취소
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;

// 스타일 추가
const CustomDialogContent = styled(DialogContent)`
    text-align: center;
    padding: 24px;
`

const StyledButton = styled(Button)`
width: 100px;
margin: 8px;
`