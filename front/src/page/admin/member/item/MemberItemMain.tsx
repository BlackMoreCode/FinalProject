import {useContext, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import AdminApi from "../../../../api/AdminApi";

import MemberItemDetail from "./MemberItemDetail";
import {Box, IconButton, Tooltip} from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";
import CancelIcon from "@mui/icons-material/Cancel";
import styled from "styled-components";
import {AdminContext} from "../../../../context/AdminStore";
import {AppDispatch} from "../../../../context/Store";
import { useDispatch } from "react-redux";
import {closeConfirmModal, setConfirmModal, setRejectModal} from "../../../../context/redux/ModalReducer";
import React from "react";
import {AdminMemberReqDto} from "../../../../api/dto/AdminDto";



const MemberItemMain = () => {
	const context = useContext(AdminContext)
	if (!context) {
		throw new Error("AdminContext가 제공되지 않았습니다.");
	}
	const {member, setMember, isImg, isIntro, setPage} = context
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	
	const fetchMember = async () => {
		try{
			const rsp = await AdminApi.getMemberDetails(searchId);
			console.log(rsp)
			if(!rsp.data) {
				dispatch(setRejectModal({message: "코드 오류로 멤버 정보가 불러와지지 않았습니다.", onCancel: null}))
			}
			setMember(rsp.data)
		} catch (error) {
			console.error(error)
			dispatch(setRejectModal({message: "통신 오류로 멤버 정보가 불러와지지 않았습니다.", onCancel: null}))
		}
	}
	const { id } = useParams();

	useEffect(() => {
		fetchMember();
	}, [id]);
	

	useEffect(() => {
		setPage("member");
	}, [setPage]);


	if (!id) {
		// id가 없는 경우 처리 (예: 멤버가 없다는 오류 메시지 표시)
		return <div>회원 정보를 찾을 수 없습니다.</div>;
	}
	const searchId = parseInt(id, 10);
	if (isNaN(searchId)) {
		// 유효하지 않은 ID일 경우 처리
		return <div>유효하지 않은 ID입니다.</div>;
	}
	
	const onClickSubmit = async () => {
		try {
			if (!member) {
				dispatch(setRejectModal({message: "회원정보가 비어있습니다.", onCancel: null}))
				return;
			}
			const memberReq : AdminMemberReqDto = {
				memberId: member.id,
				memberImg: isImg,
				introduce: isIntro,
				authority: member.authority
			}
			const rsp = await AdminApi.editMember(memberReq);
			console.log(rsp)
			if(rsp.data) {
				dispatch(setConfirmModal({ message: "수정에 성공 했습니다.", onConfirm: () => dispatch(closeConfirmModal()), onCancel: () => navigate("/admin/member") }))
				return
			}
			dispatch(setRejectModal({message: "코드 오류로 수정에 실패 했습니다.", onCancel: null}))
		} catch (error) {
			console.error(error)
			dispatch(setRejectModal({message: "통신 오류로 수정에 실패 했습니다.", onCancel: null}))
		}
	}
	
	const onClickCancel = () => {
		fetchMember()
	}
	
	return(
		<Container>
			<MemberItemDetail/>
			<ButtonContainer>
				<Tooltip title="제출하기">
					<IconButton onClick={onClickSubmit}>
						<PublishIcon sx={{color: "green"}}/>
					</IconButton>
				</Tooltip>
				<Tooltip title="취소하기">
					<IconButton onClick={onClickCancel}>
						<CancelIcon sx={{color: 'red'}}/>
					</IconButton>
				</Tooltip>
			</ButtonContainer>
		</Container>
	)
}

export default MemberItemMain;

const ButtonContainer = styled(Box)`
`

const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`