import React, { useContext, useEffect } from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from "../../../../context/AdminStore";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';

const ControlListHeader = () => {
	const context = useContext(AdminContext);

	if (!context) {
		throw new Error("AdminContext가 제공되지 않았습니다.");
	}

	const { searchQuery, setSearchQuery } = context;
	const navigate = useNavigate();

	// select 변경 (searchQuery 대신 다른 state를 사용할 수도 있음)
	const onChangeSearchOption = (event: SelectChangeEvent<"ROLE_ADMIN" | "ROLE_USER" | "REST_USER" | "" >) => {
		const value = event.target.value as "ROLE_ADMIN" | "ROLE_USER" | "REST_USER" | "";
		setSearchQuery(value);
	};

	// searchQuery 변경 시 navigate 실행
	useEffect(() => {
		// 빈 문자열이면 기본 경로로 리다이렉트
		if (searchQuery === "") {
			navigate(`/admin/member`);
		} else {
			navigate(`/admin/member/${searchQuery}`);
		}
	}, [searchQuery, navigate]);

	const searchQuerys = [
		{ value: "", label: "전체" },
		{ value: 'ROLE_USER', label: '일반 회원' },
		{ value: 'ROLE_ADMIN', label: '관리자' },
		{ value: 'REST_USER', label: '휴면 회원' },
	];

	return (
		<HeaderContainer>
			<Title>회원 조회</Title>
			<RightContainer>
				{/* 검색 입력 */}
				<DropdownContainer>
					<FormControl fullWidth variant="outlined">
						<InputLabel>검색 범위</InputLabel>
						<Select
							value={searchQuery}
							onChange={onChangeSearchOption}
							label="검색 범위"
						>
							<MenuItem value="">
								<em>검색 범위</em>
							</MenuItem>
							{searchQuerys.map((search, index) => (
								<MenuItem key={index} value={search.value}>
									{search.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</DropdownContainer>
			</RightContainer>
		</HeaderContainer>
	);
};

export default ControlListHeader;


// 전체 컨테이너 스타일링
const HeaderContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 20px 0;
	padding: 0 20px;
	width: 100%;
`;

// 왼쪽 제목
const Title = styled.div`
	font-size: 24px;
	font-weight: bold;
`;

// 오른쪽 컨테이너
const RightContainer = styled.div`
	display: flex;
	align-items: center;
	width: 60%;
`;

const DropdownContainer = styled.div`
	display: flex;
	width: 40%;
`;
