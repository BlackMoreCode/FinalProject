export interface loginReqDto {
  email: string;
  pwd: string;
}

export interface loginResDto {
  token: {
    accessToken: string;
    refreshToken: string;
  }
  grantType: string;
}

export interface signupReqDto {
  email: string;
  pwd: string;
  nickname: string;
  phone: string;
}

export interface SmsTokenVerificationDto {
  inputToken: string;
  phone: string;
}

export interface EmailTokenVerificationDto {
  inputToken: string;
  email: string;
}