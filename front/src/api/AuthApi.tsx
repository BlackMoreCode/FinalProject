import {EmailTokenVerificationDto, loginReqDto, loginResDto, SmsTokenVerificationDto,} from "./dto/AuthDto";
import axios from "axios";
import Commons from "../util/Common";

const AuthApi = {
  login: async (loginReq: loginReqDto) => {
    return await axios.post<loginResDto>(
      Commons.BASE_URL + "/auth/login",
      loginReq
    );
  },
  emailExists: async (email: string) => {
    return await axios.get<boolean>(Commons.BASE_URL + `/auth/email/${email}`);
  },
  nicknameExists: async (nickname: string) => {
    return await axios.get<boolean>(
      Commons.BASE_URL + `/auth/nickname/${nickname}`
    );
  },
  phoneExists: async (phone: string) => {
    return await axios.get<boolean>(Commons.BASE_URL + `/auth/phone/${phone}`);
  },

  signup: async (formData: FormData) => {
    try {
      return await axios.post(Commons.BASE_URL + `/auth/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },
  verifySmsToken: async (verify: SmsTokenVerificationDto) => {
    return await axios.post<boolean>(
      Commons.BASE_URL + `/auth/verify-sms-token`,
      verify
    );
  },
  sendVerificationCode: async (phone: string) => {
    console.log(phone);
    return await axios.get<string>(Commons.BASE_URL + `/auth/sendSms/${phone}`);
  },
  changePassword: async (pwd: string) => {
    return await axios.post<boolean>(
      Commons.BASE_URL + "/auth/change/password",
      pwd
    );
  },
  sendPw: async (email: string) => {
    return await axios.post<boolean>(Commons.BASE_URL + "/auth/sendPw", {email});
  },
  verifyEmailToken: async (request: EmailTokenVerificationDto) => {
    return await axios.post<boolean>(
      Commons.BASE_URL + "/auth/verify/emailToken",
      request
    );
  },
  findEmailByPhone: async (phone: string) => {
    return await axios.get<string>(
      Commons.BASE_URL + `/auth/email/phone/${phone}`
    );
  },
};
export default AuthApi;
