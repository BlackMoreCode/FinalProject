import {loginReqDto, loginResDto, signupReqDto} from "./dto/AuthDto";
import axios from "axios";
import Commons from "../util/Common";



const AuthApi = {
  login: async (loginReq : loginReqDto) => {
    return await axios.get<loginResDto>(Commons.BASE_URL + "/auth/login")
  },
  emailExists: async (email: string) => {
    return await axios.get<boolean>(Commons.BASE_URL + "/auth/exists/" + email);
  },
  nicknameExists: async (nickname: string) => {
    return await axios.get<boolean>(Commons.BASE_URL + "/auth/nickname/" + nickname);
  },
  phoneExists: async (phone: string) => {
    return await axios.get<boolean>(Commons.BASE_URL + "/auth/phone/" + phone);
  },
  signup: async (signupReq : signupReqDto) => {
    return await axios.post<string>(Commons.BASE_URL + "/auth/signup", signupReq)
  },
  verifySmsToken: async (phone : string, token : string) => {
    return await axios.get<boolean>(Commons.BASE_URL + `/auth/verifySmsToken/${phone}/${token}`)
  },
  sendVerificationCode: async (phone : string) => {
    return await axios.get<string>(Commons.BASE_URL + "/auth/sendVerificationCode/" + phone);
  }

}
export default AuthApi;