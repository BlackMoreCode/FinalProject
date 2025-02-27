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