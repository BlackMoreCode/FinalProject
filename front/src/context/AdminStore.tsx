import React, {createContext, ReactNode, useState} from "react";
import {AdminMemberResDto} from "../api/dto/AdminDto";
import {SelectChangeEvent} from "@mui/material";

// 상태 값들의 타입 정의
interface AdminContextType {
	page: string;
	setPage: React.Dispatch<React.SetStateAction<string>>;
	searchQuery: "ROLE_ADMIN" | "ROLE_USER" | "REST_USER" | "";
	setSearchQuery: React.Dispatch<"ROLE_ADMIN" | "ROLE_USER" | "REST_USER" | "">;
	boardCategory: string;
	setBoardCategory: React.Dispatch<React.SetStateAction<string>>;
	member: AdminMemberResDto | null;
	setMember: React.Dispatch<React.SetStateAction<AdminMemberResDto | null>>;
	isImg: boolean;
	setIsImg: React.Dispatch<React.SetStateAction<boolean>>;
	isIntro: boolean;
	setIsIntro: React.Dispatch<React.SetStateAction<boolean>>;
}

// AdminContext 생성
export const AdminContext = createContext<AdminContextType | null>(null);

interface AdminStoreProps {
	children: ReactNode;
}

const AdminStore: React.FC<AdminStoreProps> = ({ children }) => {
	const [page, setPage] = useState<string>("main");
	const [searchQuery, setSearchQuery] = useState<"ROLE_ADMIN" | "ROLE_USER" | "REST_USER" | "">("");
	const [boardCategory, setBoardCategory] = useState<string>("food");
	const [member, setMember] = useState<AdminMemberResDto | null>(null);
	const [isImg, setIsImg] = useState<boolean>(false);
	const [isIntro, setIsIntro] = useState<boolean>(false);

	return (
		<AdminContext.Provider
			value={{
				page,
				setPage,
				searchQuery,
				setSearchQuery,
				boardCategory,
				setBoardCategory,
				member,
				setMember,
				isImg,
				setIsImg,
				isIntro,
				setIsIntro,
			}}
		>
			{children}
		</AdminContext.Provider>
	);
};

export default AdminStore;