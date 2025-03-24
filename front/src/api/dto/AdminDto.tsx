export interface AdminMemberListResDto {
  id: number;
  nickname: string;
  authority: "ROLE_ADMIN" | "ROLE_USER" | "REST_USER"
  memberImg: string;
}

export interface AdminMemberResDto {
  id: number;
  nickname: string;
  authority: "ROLE_ADMIN" | "ROLE_USER" | "REST_USER"
  memberImg: string;
  phone: string;
  introduce: string;
  email: string;
  regDate: string;
}

export interface AdminMemberReqDto {
  memberId: number;
  memberImg: boolean;
  introduce: boolean;
  authority: "ROLE_ADMIN" | "ROLE_USER" | "REST_USER"
}

export interface ChartResDto {
  id: string;
  name: string;
  like: number;
  view: number;
}