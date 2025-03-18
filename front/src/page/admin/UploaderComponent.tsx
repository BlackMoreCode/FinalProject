import { Box, Button, Typography } from "@mui/material";
import { useRef, useState } from "react";
import AdminApi from "../../api/AdminApi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../context/Store";
import { setRejectModal } from "../../context/redux/ModalReducer";
import React from "react";
import styled from "styled-components";

interface UploaderProps {
	type: "cocktail" | "food" | "forum";
}

const UploaderComponent = ({ type }: UploaderProps) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	// 🔹 파일 업로드 API
	const handleUpload = async () => {
		if (!selectedFile) {
			dispatch(setRejectModal({ message: "파일을 올리고 클릭해 주세요", onCancel: null }));
			return;
		}
		try {
			const formData = new FormData();
			formData.append("file", selectedFile);
			const rsp = await AdminApi.uploadJson(formData, type);
			if (!rsp.data) {
				dispatch(setRejectModal({ message: "파일 업로드 중 코드 오류 발생.", onCancel: null }));
			}
		} catch (error) {
			dispatch(setRejectModal({ message: "파일 업로드 중 통신 오류 발생.", onCancel: null }));
			console.error("파일 업로드 중 오류:", error);
		}
	};

	// 🔹 드래그된 파일 처리
	const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	// 🔹 드래그 오버 상태 처리
	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	// 🔹 파일 선택 변경 처리
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	return (
		<Container>
			<Typography variant="h3" sx={{ marginTop: "50px" }}>{type}</Typography>
			<Box
				sx={{
					padding: 4,
					textAlign: "center",
					marginTop: 4,
					backgroundColor: "#ffffff",
					cursor: "pointer",
					border: "2px dashed #6A5ACD",
					borderRadius: "8px",
					transition: "border 0.2s",
					"&:hover": {
						border: "2px dashed #5A4ACD",
					},
				}}
				onClick={() => fileInputRef.current?.click()}
				onDrop={handleFileDrop}
				onDragOver={handleDragOver}
			>
				<Typography sx={{ color: "#6A5ACD", fontWeight: "bold" }}>
					{selectedFile ? selectedFile.name : "여기를 클릭하여 파일을 선택하거나 파일을 드래그해서 넣으세요"}
				</Typography>
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					style={{ display: "none" }}
				/>
			</Box>

			{/* 파일 업로드 버튼 */}
			<Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 3 }}>
				<Button
					variant="contained"
					sx={{
						backgroundColor: "#6A5ACD",
						color: "#fff",
						fontWeight: "bold",
						padding: "12px 24px",
						fontSize: "16px",
						borderRadius: "6px",
						"&:hover": { backgroundColor: "#5A4ACD" },
					}}
					onClick={handleUpload}
				>
					{type} 업로드
				</Button>
			</Box>
		</Container>
	);
};

export default UploaderComponent;

const Container = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
`;
