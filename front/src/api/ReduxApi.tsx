import axiosInstance from "./AxiosInstance";
import Commons from "../util/Common";
import {MyInfo} from "./dto/ReduxDto";
import axios from "axios";


const API_BASE_URL = Commons.BASE_URL +  "/hook";

const ReduxApi = {
  getMyInfo: async () => {
    return await axiosInstance.get<MyInfo>(API_BASE_URL + "/myinfo")
  },
  refresh: async (refreshToken : string) => {
    return await axios.post<string>(`${Commons.BASE_URL}/auth/refresh`, { refreshToken });
  }
}
export default ReduxApi