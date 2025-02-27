import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../context/Store";
import { closeTitleNContentModal } from "../../context/redux/ModalReducer";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const TitleNContentModal = () => {
  const modal = useSelector((state: RootState) => state.modal.titleNContentModal);
  const dispatch = useDispatch<AppDispatch>();

  const onClose = () => {
    modal.onCancel?.(); // onCancel이 정의된 경우 실행
    dispatch(closeTitleNContentModal());
  };

  return (
    <Dialog open={modal.open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{modal.title}</DialogTitle>
      <DialogContent dividers>
        <p style={{ whiteSpace: "pre-line", lineHeight: "1.5" }}>{modal.content}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TitleNContentModal;
