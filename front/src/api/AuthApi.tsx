import {
  EmailTokenVerificationDto,
  loginReqDto,
  loginResDto,
  signupReqDto,
  SmsTokenVerificationDto
} from "./dto/AuthDto";
import axios from "axios";
import Commons from "../util/Common";
import {string} from "yup";

const AuthApi = {
  login: async (loginReq : loginReqDto) => {
    return await axios.post<loginResDto>(Commons.BASE_URL + "/auth/login", {loginReqDto : loginReq});
  },
  emailExists: async (email: string) => {
    return await axios.get<boolean>(Commons.BASE_URL + `/auth/email/${email}`);
  },
  nicknameExists: async (nickname: string) => {
    return await axios.get<boolean>(Commons.BASE_URL + `/auth/nickname/${nickname}`);
  },
  phoneExists: async (phone: string) => {
    return await axios.get<boolean>(Commons.BASE_URL + `/auth/phone/${phone}`);
  },
  signup: async (signupReq : signupReqDto) => {
    return await axios.post<string>(Commons.BASE_URL + "/auth/signup", signupReq)
  },
  verifySmsToken: async (verify : SmsTokenVerificationDto) => {
    return await axios.post<boolean>(Commons.BASE_URL + `/auth/verify-sms-token`, {request : verify})
  },
  sendVerificationCode: async (phone : string) => {
    return await axios.post<string>(Commons.BASE_URL + "/auth/sendSms" , {phone : phone});
  },
  changePassword: async (pwd : string) => {
    return await axios.post<boolean>(Commons.BASE_URL + "/auth/change/password", pwd);
  },
  sendPw: async (email : string) => {
    return await axios.post<boolean>(Commons.BASE_URL + "/auth/sendPw", email);
  },
  verifyEmailToken: async (request : EmailTokenVerificationDto) => {
    return await axios.post<boolean>(Commons.BASE_URL + "/auth/verify/emailToken", request);
  },
  findEmailByPhone: async (phone : string) => {
    return await axios.get<string>(Commons.BASE_URL + `/auth/email/phone/${phone}`);
  }

}
export default AuthApi;