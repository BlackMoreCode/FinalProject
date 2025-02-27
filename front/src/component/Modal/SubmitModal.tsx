import React, {useEffect, useState} from "react";
import { Dialog, DialogContent, DialogActions, Typography, Button, TextField } from "@mui/material";
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../context/Store";
import {closeSubmitModal, setRejectModal} from "../../context/redux/ModalReducer";
import {Change} from "../../context/types";

const SubmitModal = () => {
	const submit = useSelector((state : RootState) => state.modal.submitModal)
	const dispatcher = useDispatch<AppDispatch>()
	const [content, setContent] = useState<string>("");
	const [id, setId] = useState<string>("");

	useEffect(() => {
		setContent(submit.initial.content);
		setId(submit.initial.id);
	}, [submit.initial]);

	const onChangeContent: Change = (e) => {
		if (submit.restriction) {
			dispatcher(setRejectModal({message: submit.restriction, onCancel: () => {} }));
			return;
		}
		setContent(e.target.value);
	};

	const onSubmitHandler = () => {
		if (content.trim() === "") {
			dispatcher(setRejectModal({message: "메세지를 입력하세요.", onCancel: () => {} }));
			return;
		}

		submit.onSubmit({ content: content, id: id }); // 댓글 제출 또는 수정 처리
		setContent(""); // 내용 초기화
		onCancel(); // 모달 닫기
	};

	const onCancel = () => {
		submit.onCancel();
		dispatcher(closeSubmitModal())
	}

	if (!submit.open) return null;

	return (
		<Dialog open={submit.open} onClose={onCancel} maxWidth="xs" fullWidth>
			<CustomDialogContent>
				<Typography variant="h6" gutterBottom>
					{submit.message &&
						submit.message.split("\n").map((line, index) => (
							<span key={index}>
                {line}
								<br />
              </span>
						))}
				</Typography>
				<TextField onChange={onChangeContent} value={content} multiline={true} minRows={3} maxRows={8} />
			</CustomDialogContent>
			<DialogActions>
				<StyledButton variant="contained" color="primary" onClick={onSubmitHandler}>
					제출
				</StyledButton>
				<StyledButton variant="outlined" color="error" onClick={onCancel}>
					취소
				</StyledButton>
			</DialogActions>
		</Dialog>
	);
};

export default SubmitModal;

// 스타일 추가
const CustomDialogContent = styled(DialogContent)`
	text-align: center;
	padding: 24px;
`;

const StyledButton = styled(Button)`
	width: 100px;
	margin: 8px;
`;
