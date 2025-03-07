import AxiosInstance from "./AxiosInstance";

/**
 * ForumApi.js (리팩토링)
 * - 백엔드 Spring Boot 컨트롤러의 경로에 맞게 엔드포인트를 수정했습니다.
 * - 예: 게시글 생성은 POST /api/forums/posts, 댓글 생성은 POST /api/forums/comments
 */
const ForumApi = {
  // ------------------ 카테고리 관련 ------------------
  /**
   * 모든 포럼 카테고리 가져오기
   * 엔드포인트: GET /api/forums/categories/proxy
   */
  fetchCategories: async () => {
    try {
      const response = await AxiosInstance.get("/api/forums/categories/proxy");
      console.log("Fetched Categories:", response.data);
      return response.data;
    } catch (error) {
      console.error("포럼 카테고리 가져오기 중 오류:", error);
      throw error;
    }
  },

  // ------------------ 게시글(Post) 관련 ------------------
  /**
   * 특정 게시글 상세 정보 가져오기
   * 엔드포인트: GET /api/forums/posts/{postId}
   * @param {number} postId - 게시글 ID
   */
  getPostById: async (postId) => {
    try {
      const response = await AxiosInstance.get(`/api/forums/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error("포럼 게시글 상세 조회 중 오류:", error);
      throw error;
    }
  },

  /**
   * 포럼 게시글 생성
   * 엔드포인트: POST /api/forums/posts
   * @param {Object} data - 게시글 생성 데이터 (제목, 내용, 카테고리 등)
   */
  createPost: async (data) => {
    try {
      const response = await AxiosInstance.post("/api/forums/posts", data);
      return response.data;
    } catch (error) {
      console.error("포럼 게시글 생성 중 오류:", error);
      throw error;
    }
  },

  /**
   * 포럼 게시글 제목 수정
   * 엔드포인트: PUT /api/forums/posts/{postId}/title?loggedInMemberId=...&isAdmin=...
   * @param {number} postId - 수정할 게시글 ID
   * @param {Object} data - 수정 데이터 (새 제목 포함)
   * @param {number} loggedInMemberId - 로그인된 사용자 ID
   * @param {boolean} isAdmin - 관리자 여부
   */
  updatePostTitle: async (postId, data, loggedInMemberId, isAdmin) => {
    try {
      const response = await AxiosInstance.put(
        `/api/forums/posts/${postId}/title?loggedInMemberId=${loggedInMemberId}&isAdmin=${isAdmin}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("포럼 게시글 제목 수정 중 오류:", error);
      throw error;
    }
  },

  /**
   * 포럼 게시글 내용 수정 (TipTap JSON 전용)
   * 엔드포인트: PUT /api/forums/posts/{postId}/content?loggedInMemberId=...&isAdmin=...
   * @param {number} postId - 수정할 게시글 ID
   * @param {Object} data - 수정 데이터 (contentJSON 포함)
   * @param {number} loggedInMemberId - 로그인된 사용자 ID
   * @param {boolean} isAdmin - 관리자 여부
   */
  updatePostContent: async (postId, data, loggedInMemberId, isAdmin) => {
    try {
      const response = await AxiosInstance.put(
        `/api/forums/posts/${postId}/content?loggedInMemberId=${loggedInMemberId}&isAdmin=${isAdmin}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("포럼 게시글 내용 수정 중 오류:", error);
      throw error;
    }
  },

  /**
   * 포럼 게시글 삭제 (논리 삭제)
   * 엔드포인트: DELETE /api/forums/posts/{postId}?loggedInMemberId=...&removedBy=...&isAdmin=...
   * @param {number} postId - 삭제할 게시글 ID
   * @param {number} loggedInMemberId - 로그인된 사용자 ID
   * @param {string} removedBy - 삭제 수행자 (작성자 이름 또는 "ADMIN")
   * @param {boolean} isAdmin - 관리자 여부
   */
  deletePost: async (postId, loggedInMemberId, removedBy, isAdmin) => {
    try {
      const url = `/api/forums/posts/${postId}?loggedInMemberId=${loggedInMemberId}&removedBy=${encodeURIComponent(
        removedBy
      )}&isAdmin=${isAdmin}`;
      console.log(`Request URL: ${url}`);
      await AxiosInstance.delete(url);
    } catch (error) {
      console.error("포럼 게시글 삭제 중 오류:", error);
      throw error;
    }
  },

  /**
   * 포럼 게시글 하드 삭제 (관리자 전용)
   * 엔드포인트: DELETE /api/forums/posts/{postId}/hard-delete?loggedInMemberId=...
   * @param {number} postId - 하드 삭제할 게시글 ID
   * @param {number} loggedInMemberId - 로그인된 관리자 ID
   */
  hardDeletePost: async (postId, loggedInMemberId) => {
    try {
      const response = await AxiosInstance.delete(
        `/api/forums/posts/${postId}/hard-delete?loggedInMemberId=${loggedInMemberId}`
      );
      console.log("포럼 게시글 하드 삭제 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("포럼 게시글 하드 삭제 중 오류:", error);
      throw error;
    }
  },

  /**
   * 포럼 게시글 신고 처리
   * 엔드포인트: POST /api/forums/posts/{postId}/report?reporterId=...
   * @param {number} postId - 신고할 게시글 ID
   * @param {number} reporterId - 신고자 ID
   * @param {string} reason - 신고 사유
   */
  reportPost: async (postId, reporterId, reason) => {
    try {
      const response = await AxiosInstance.post(
        `/api/forums/posts/${postId}/report`,
        { reason },
        { params: { reporterId } }
      );
      return response.data;
    } catch (error) {
      console.error("포럼 게시글 신고 중 오류:", error);
      throw error;
    }
  },

  /**
   * 포럼 게시글 복원
   * 엔드포인트: POST /api/forums/posts/{postId}/restore
   * @param {number} postId - 복원할 게시글 ID
   */
  restorePost: async (postId) => {
    try {
      const response = await AxiosInstance.post(
        `/api/forums/posts/${postId}/restore`
      );
      return response.data;
    } catch (error) {
      console.error("포럼 게시글 복원 중 오류:", error);
      throw error;
    }
  },

  // ------------------ 댓글(Comment) 관련 ------------------
  /**
   * 특정 게시글의 댓글 가져오기
   * 엔드포인트: GET /api/forums/comments/{postId}
   * @param {number} postId - 게시글 ID
   */
  getCommentsByPostId: async (postId) => {
    try {
      const response = await AxiosInstance.get(
        `/api/forums/comments/${postId}`
      );
      console.log("Fetched Comments:", response.data);
      return response.data;
    } catch (error) {
      console.error("포럼 댓글 조회 중 오류:", error);
      throw error;
    }
  },

  /**
   * 댓글 생성 (포럼)
   * 엔드포인트: POST /api/forums/comments
   * @param {Object} data - 댓글 생성 데이터 (postId, memberId, content 등)
   * @param {string} token - 사용자 액세스 토큰 (Authorization 헤더 사용)
   */
  addComment: async (data, token) => {
    try {
      const response = await AxiosInstance.post("/api/forums/comments", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("포럼 댓글 생성 중 오류:", error);
      throw error;
    }
  },

  /**
   * 댓글 수정 (포럼)
   * 엔드포인트: PUT /api/forums/comments/{commentId}?loggedInMemberId=...&isAdmin=...
   * @param {number} commentId - 수정할 댓글 ID
   * @param {Object} data - 수정 데이터 (content, contentJSON 등)
   * @param {number} loggedInMemberId - 로그인된 사용자 ID
   * @param {boolean} isAdmin - 관리자 여부
   */
  editComment: async (commentId, data, loggedInMemberId, isAdmin) => {
    try {
      if (!loggedInMemberId) {
        throw new Error("로그인된 사용자 ID가 필요합니다.");
      }
      const response = await AxiosInstance.put(
        `/api/forums/comments/${commentId}?loggedInMemberId=${loggedInMemberId}&isAdmin=${isAdmin}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("포럼 댓글 수정 중 오류:", error);
      throw error;
    }
  },

  /**
   * 댓글 삭제 (포럼, 논리 삭제)
   * 엔드포인트: DELETE /api/forums/comments/{commentId}?loggedInMemberId=...&isAdmin=...
   * @param {number} commentId - 삭제할 댓글 ID
   * @param {number} loggedInMemberId - 로그인된 사용자 ID
   * @param {boolean} isAdmin - 관리자 여부
   */
  deleteComment: async (commentId, loggedInMemberId, isAdmin) => {
    try {
      const response = await AxiosInstance.delete(
        `/api/forums/comments/${commentId}?loggedInMemberId=${loggedInMemberId}&isAdmin=${isAdmin}`
      );
      return response.data;
    } catch (error) {
      console.error("포럼 댓글 삭제 중 오류:", error);
      throw error;
    }
  },

  /**
   * 댓글 하드 삭제 (포럼, 관리자 전용)
   * 엔드포인트: DELETE /api/forums/comments/{commentId}/hard-delete?loggedInMemberId=...
   * @param {number} commentId - 하드 삭제할 댓글 ID
   * @param {number} loggedInMemberId - 로그인된 관리자 ID
   */
  hardDeleteComment: async (commentId, loggedInMemberId) => {
    try {
      const response = await AxiosInstance.delete(
        `/api/forums/comments/${commentId}/hard-delete?loggedInMemberId=${loggedInMemberId}`
      );
      console.log("포럼 댓글 하드 삭제 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("포럼 댓글 하드 삭제 중 오류:", error);
      throw error;
    }
  },

  /**
   * 댓글 신고 (포럼)
   * 엔드포인트: POST /api/forums/comments/{commentId}/report?reporterId=...
   * @param {number} commentId - 신고할 댓글 ID
   * @param {number} reporterId - 신고자 ID
   * @param {string} reason - 신고 사유
   */
  reportComment: async (commentId, reporterId, reason) => {
    try {
      const response = await AxiosInstance.post(
        `/api/forums/comments/${commentId}/report`,
        { reason },
        { params: { reporterId } }
      );
      return response.data;
    } catch (error) {
      console.error("포럼 댓글 신고 중 오류:", error);
      throw error;
    }
  },

  /**
   * 댓글 복원 (포럼)
   * 엔드포인트: POST /api/forums/comments/{commentId}/restore
   * @param {number} commentId - 복원할 댓글 ID
   */
  restoreComment: async (commentId) => {
    try {
      const response = await AxiosInstance.post(
        `/api/forums/comments/${commentId}/restore`
      );
      return response.data;
    } catch (error) {
      console.error("포럼 댓글 복원 중 오류:", error);
      throw error;
    }
  },
};

export default ForumApi;
