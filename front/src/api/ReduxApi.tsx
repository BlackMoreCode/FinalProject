import axiosInstance from "./AxiosInstance";
import Commons from "../util/Common";
import {MyInfo} from "./dto/ReduxDto";


const API_BASE_URL = Commons.BASE_URL +  "/hook";

const ReduxApi = {
  getMyInfo: async () => {
    return await axiosInstance.get<MyInfo>(API_BASE_URL + "/myinfo")
  }
}
export default ReduxApi