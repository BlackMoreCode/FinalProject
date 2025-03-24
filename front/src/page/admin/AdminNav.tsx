import {useContext, useEffect, useState} from "react";
import styled from "styled-components";
import { Paper } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../context/Store";
import React from "react";
import {setRejectModal} from "../../context/redux/ModalReducer";
import {AdminContext} from "../../context/AdminStore";

// AdminNavContainer 스타일링 (MUI Paper의 스타일링 적용)
const AdminContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-start;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
`;

const AdminNavContainer = styled(Paper)`
    display: flex;
    flex-direction: column;
    gap: 10px; /* 버튼 간 간격 */
    justify-content: center;
    align-items: center;
    width: 300px;
		height: 500px;
    margin: 50px 30px;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    background-color: #ece1ff;

    @media (max-width: 768px) {
        width: 80%; /* 화면 크기에 맞춰 조정 */
        flex-direction: row;
        flex-wrap: wrap; /* 버튼들이 두 줄로 나뉘도록 설정 */
        gap: 20px; /* 버튼 간 간격을 좀 더 넓게 설정 */
        height: auto;
    }
`;

const StyledButton = styled.button<{ isActive: boolean }>`
	width: 100%;
	margin: 12px 0;
	border-radius: 12px;
	text-transform: none;
	font-weight: bold;
	padding: 10px 0;
	background-color: ${(props) => (props.isActive ? "#6154D4" : "transparent")};
	color: ${(props) => (props.isActive ? "#fff" : "#000")};
	border: ${(props) => (props.isActive ? "2px solid #6154D4" : "2px solid transparent")};
	transition: all 0.2s ease-in-out;
	text-align: center;

	&:hover {
		background-color: #6154D4;
		color: #fff;
		border: 2px solid #6154D4;
		transform: scale(1.05);
	}
`;

interface nav {
	name: string;
	id: string;
	link: string;
}

const AdminNav = () => {
	const navList : nav[] = [
		{ name: "메인 페이지", id: "main", link: "/admin" },
		{ name: "차트 페이지", id: "chart", link: "/admin/chart" },
		{ name: "회원 관리 페이지", id: "member", link: "/admin/member" },
	];
	const dispatch = useDispatch<AppDispatch>();
	const admin = useSelector((state: RootState) => state.user.admin)
	const navigate = useNavigate();
	useEffect(() => {
		if(!admin){
			dispatch(setRejectModal({message: "해당 페이지를 확인할 권한이 없습니다.", onCancel: () =>  navigate("/")}))
		}
	}, [admin]);

	const context = useContext(AdminContext);
	const page = context?.page
	const handleOnClick = (e:nav) => {
		navigate(e.link);
	};
	
	return (
		<AdminContainer>
			<AdminNavContainer elevation={3}>
				{navList.map((nav) => (
					<StyledButton
						key={nav.id}
						onClick={() => handleOnClick(nav)}
						isActive={nav.id === page}  // 활성화된 버튼에 스타일 적용
					>
						{nav.name}
					</StyledButton>
				))}
			</AdminNavContainer>
			<Outlet />
		</AdminContainer>
	);
};

export default AdminNav;
