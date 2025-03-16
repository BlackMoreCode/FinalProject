import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminApi from "../../../../api/AdminApi";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import ControlListComponent from "./ControlListComponent";
import ControlListHeader from "./ControlListHeader";
import {RootState} from "../../../../context/Store";
import { AdminContext } from "../../../../context/AdminStore";
import {AdminMemberListResDto} from "../../../../api/dto/AdminDto";
import React from "react";

const MemberControlMain = () => {
	const admin = useSelector((state : RootState) => state.user.admin);
	const context = useContext(AdminContext);
	const setPage = context?.setPage;
	const [memberList, setMemberList] = useState<AdminMemberListResDto[] | []>([]);
	const {search} = useParams();

	const searchValue = search ? search.toString() : null;  // 존재하지 않을 경우 빈 문자열

	console.log(search, searchValue);

	useEffect(() => {
		if (setPage) {
			setPage("member");
		}
	}, [admin]);
	
	useEffect(() => {
		// 멤버 리스트를 가져오는 함수
		const fetchMembers = async () => {
			try {
				const rsp = await AdminApi.getMemberList(searchValue);
				console.log("멤버 조회 : ", rsp);
				
				// 응답이 성공적이면 멤버 리스트 상태에 저장
				if (rsp && rsp.data) {
					setMemberList(rsp.data);  // API 응답에 따라 데이터를 상태에 저장
				}
			} catch (error) {
				console.error("회원 목록 조회 실패:", error);
			}
		};
		
		// 검색 값이나 옵션이 바뀔 때마다 fetchMembers 실행
		fetchMembers();
	}, [searchValue]);
	
	
	
	return (
			<Box sx={styles.container}>
				<ControlListHeader/>
				{/* 테이블 렌더링 */}
				<ControlListComponent list={memberList} />
				{/* 글 작성 버튼 (조건에 따라 표시) */}
			</Box>
	);
};

const styles = {
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: "20px",
		position: "relative",
		width: "100%",
	},
};

export default MemberControlMain;
