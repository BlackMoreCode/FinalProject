import React, { useContext } from "react";
import {
	Box,
	Paper,
	Typography,
	Stack,
	Avatar,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	FormControlLabel,
	Checkbox,
	SelectChangeEvent
} from "@mui/material";
import { AdminContext } from "../../../../context/AdminStore";
import Commons from "../../../../util/Common";
import { AdminMemberResDto } from "../../../../api/dto/AdminDto";
import PersonIcon from "@mui/icons-material/Person";

const data: { label: string; id: string; select: boolean }[] = [
	{ label: "이미지", id: "memberImg", select: true },
	{ label: "이름", id: "nickname", select: false },
	{ label: "이메일", id: "email", select: false },
	{ label: "권한", id: "authority", select: true },
	{ label: "설명", id: "introduce", select: true },
	{ label: "등록 날짜", id: "regDate", select: false },
];

const authorityList : {value: "ROLE_ADMIN" | "ROLE_USER" | "REST_USER", label: string}[] = [
	{ value: "ROLE_ADMIN", label: "관리자 계정" },
	{ value: "ROLE_USER", label: "일반 회원" },
	{ value: "REST_USER", label: "휴면 회원" },
];

const MemberItemDetail = () => {
	const context = useContext(AdminContext);
	if (!context) {
		throw new Error("AdminContext가 제공되지 않았습니다.");
	}

	const { member, setMember, setIsImg, setIsIntro } = context;

	if (!member) return null;

	const onChangeAuthority = (e: SelectChangeEvent<"ROLE_ADMIN" | "ROLE_USER" | "REST_USER">) => {
		const value = e.target.value as "ROLE_ADMIN" | "ROLE_USER" | "REST_USER";
		setMember({ ...member, authority: value });
	};

	// 이미지 삭제 여부 토글 핸들러
	const onChangeIsImg = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsImg(e.target.checked);
	};

	// 소개글 삭제 여부 토글 핸들러
	const onChangeIsIntro = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsIntro(e.target.checked);
	};

	return (
		<Paper elevation={3} sx={{ padding: 3, width: "100%", margin: "auto" }}>
			<Typography variant="h6" gutterBottom>
				사용자 정보
			</Typography>
			<Stack spacing={2}>
				{data.map((item, index) => {
					const value = member[item.id as keyof AdminMemberResDto] || "정보 없음";
					return (
						<Box
							key={index}
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								borderBottom: index !== data.length - 1 ? "1px solid #ddd" : "none",
								pb: 1,
							}}
						>
							<Typography variant="subtitle1" fontWeight="bold">
								{item.label}
							</Typography>

							{/* 권한 선택 드롭다운 */}
							{item.id === "authority" && (
								<FormControl size="small" sx={{ minWidth: 120 }}>
									<Select value={member.authority} onChange={onChangeAuthority}>
										{authorityList.map((auth, index) => (
											<MenuItem key={index} value={auth.value}>
												{auth.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							)}

							{/* 이미지 영역 */}
							{item.id === "memberImg" && (
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Avatar
										src={member.memberImg || ""}
										alt="사용자 이미지"
										sx={{ width: 50, height: 50, bgcolor: !member.memberImg ? "grey.300" : "transparent" }}
									>
										{!member.memberImg && <PersonIcon />}
									</Avatar>
									<FormControlLabel
										control={<Checkbox onChange={onChangeIsImg} disabled={!member.memberImg} />}
										label="이미지 삭제"
									/>
								</Box>
							)}

							{/* 소개글 영역 */}
							{item.id === "introduce" && (
								<Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
									<Typography variant="body1">{value}</Typography>
									<FormControlLabel
										control={<Checkbox onChange={onChangeIsIntro} disabled={!member.introduce} />}
										label="소개 삭제"
										sx={{ mt: 1 }}
									/>
								</Box>
							)}

							{/* 기본 텍스트 데이터 */}
							{!item.select && (
								<Typography variant="body1">
									{item.id.includes("Date") ? (value === "정보 없음" ? "정보 없음" : Commons.formatDate(value)) : value}
								</Typography>
							)}
						</Box>
					);
				})}
			</Stack>
		</Paper>
	);
};

export default MemberItemDetail;
