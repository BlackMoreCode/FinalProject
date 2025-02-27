import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../context/Store";
import { closeOptionModal } from "../../context/redux/ModalReducer";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const OptionsModal = () => {
	const optionModal = useSelector((state: RootState) => state.modal.optionModal);
	const dispatch = useDispatch<AppDispatch>();

	if (!optionModal.open) return null;

	const onCancel = () => {
		optionModal.onCancel?.();
		dispatch(closeOptionModal());
	};

	return (
		<Dialog open={optionModal.open} onClose={onCancel} maxWidth="xs" fullWidth>
			<DialogTitle>알림</DialogTitle>
			<DialogContent dividers>
				{optionModal.message?.split("\n").map((line, index) => (
					<p key={index} style={{ margin: 0 }}>
						{line}
					</p>
				))}
			</DialogContent>
			<DialogActions>
				{optionModal.options?.map((option, index) => (
					<Button
						key={index}
						variant={option.type === "outlined" ? "outlined" : "contained"}
						color={option.type === "outlined" ? "error" : "primary"}
						onClick={() => optionModal.onOption(option.value)}
						fullWidth
					>
						{option.label}
					</Button>
				))}
				<Button variant="outlined" color="error" onClick={onCancel} fullWidth>
					취소
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default OptionsModal;
