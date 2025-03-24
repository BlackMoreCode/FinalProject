import React, {createContext, ReactNode, useState} from "react";
import {AdminMemberResDto, ChartResDto} from "../api/dto/AdminDto";
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
	chart: ChartResDto[] | null;
	setChart: React.Dispatch<React.SetStateAction<ChartResDto[] | null>>;
	type: "cocktail" | "food";
	setType: React.Dispatch<React.SetStateAction<"cocktail" | "food">>;
	order: "like" | "view";
	setOrder: React.Dispatch<React.SetStateAction<"like" | "view">>;
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
	const [chart, setChart] = useState<ChartResDto[] | null>(null);
	const [type, setType] = useState<"cocktail" | "food">("cocktail");
	const [order, setOrder] = useState<"like" | "view">("view");

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
				chart,
				setChart,
				type,
				setType,
				order,
				setOrder,
			}}
		>
			{children}
		</AdminContext.Provider>
	);
};

export default AdminStore;