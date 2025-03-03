import React from "react";
import { Dialog, DialogContent, DialogActions, Typography, Button } from "@mui/material";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../context/Store";
import {closeRejectModal} from "../../context/redux/ModalReducer";


const
RejectModal = () => {
	const reject = useSelector((state : RootState) => state.modal.rejectModal)
	const dispatcher = useDispatch<AppDispatch>()
	const onCancel = () => {
		reject.onCancel?.()
		dispatcher(closeRejectModal())
	}
	return (
		<Dialog open={reject.open} onClose={onCancel} maxWidth="xs" fullWidth>
			<CustomDialogContent>
				<Typography variant="h6" gutterBottom>
					{reject.message && reject.message.split("\n").map((line, index) => (
						<span key={index}>
							{line}
							<br />
						</span>
					))}
				</Typography>
			</CustomDialogContent>
			<DialogActions>
				<StyledButton variant="contained" color="error" onClick={onCancel}>
					닫기
				</StyledButton>
			</DialogActions>
		</Dialog>
	);
};

export default RejectModal;

// 스타일 추가
const CustomDialogContent = styled(DialogContent)`
    text-align: center;
    padding: 24px;
`;

const StyledButton = styled(Button)`
    width: 100px;
    margin: 8px;
`;
