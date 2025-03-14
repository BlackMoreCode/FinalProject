export interface MyInfo {
  id: number;
  email: string;
  nickname: string;
  role: "ROLE_ADMIN" | "ROLE_USER";
  likedRecipes: Set<string>; // 좋아요한 레시피 ID 목록
  reportedRecipes: Set<string>; // 신고한 레시피 ID 목록
}

export interface AccessTokenDto {
  grantType: string;
  accessToken: string;
  accessTokenExpires: number;
}
