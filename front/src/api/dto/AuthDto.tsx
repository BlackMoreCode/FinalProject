export interface loginReqDto {
  email: string;
  pwd: string;
}

export interface loginResDto {
  grantType: string;               // 인증 방식
  accessToken: string;             // 액세스 토큰
  accessTokenExpiresIn: number;    // 액세스 토큰 만료 시간
  refreshToken: string;            // 리프래시 토큰
  refreshTokenExpiresIn: number;   // 리프래시 토큰 만료 시간
  authority: string;               // 권한
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