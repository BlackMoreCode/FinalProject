import Commons from "../util/Common";
import axiosInstance from "./AxiosInstance";
import {AdminMemberListResDto, AdminMemberReqDto, AdminMemberResDto} from "./dto/AdminDto";

const baseUrl = Commons.BASE_URL


// 주는거
const AdminApi = {
	getMemberList: ( searchValue : string | null) => {
		return axiosInstance.get<AdminMemberListResDto[]>(baseUrl + `/admin/member/list/${searchValue}`);
	},
	getMemberDetails: (memberId : number) => {
		return axiosInstance.get<AdminMemberResDto>(baseUrl + `/admin/member/detail/${memberId}`);
	},
	editMember(member : AdminMemberReqDto) {
		return axiosInstance.post<AdminMemberResDto>(baseUrl + `/admin/member/edit`, member)
	},
	uploadJson: (formData : FormData, type : "cocktail" | "food" | "forum") => {
		return axiosInstance.post<boolean>(baseUrl + `/admin/upload/${type}`, formData,{
			headers: {
				"Content-Type": "multipart/form-data",
			},
			withCredentials: true, // 인증 필요 시
		})
	}
}
export default AdminApi;