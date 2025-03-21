import axiosInstance from "./AxiosInstance";

const ProfileApi = {
  // 로그인한 유저 ID 가져오기
  getLoggedInUserId: () => {
    return axiosInstance.get("/api/profile/getId");
  },

  // 맴버십 구매 여부 확인
  checkMembership: () => {
    return axiosInstance.get("/api/purchase/check");
  },
  getProfile: () => {
    return axiosInstance.get("/api/profile/get");
  },

  getProfileCard: (userId: string) => {
    return axiosInstance.get(`/api/profile/${userId}`);
  },

  // 프로필 수정 요청
  updateProfileInfo: (profileData: { nickName: string; introduce: string }) => {
    return axiosInstance.put("/api/profile/info", profileData);
  },

  // 프로필 이미지 업로드 요청
  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return axiosInstance.post("/api/profile/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  // 특정 유저의 레시피 리스트를 가져오는 메서드
  getUserRecipes: (memberId: number, page: number, size: number) => {
    return axiosInstance
      .get(`/api/profile/recipes`, {
        params: { memberId, page, size },
      })
      .then((response) => response.data); // 응답 데이터 구조 맞추기
  },

  // 특정 유저의 게시글 리스트를 가져오는 메서드
  getUserPosts: (memberId: number, page: number, size: number) => {
    return axiosInstance.get(`/api/forums/my/posts`, {
      params: { memberId, page, size },
    });
  },
};

export default ProfileApi;
