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
}
export default AdminApi;