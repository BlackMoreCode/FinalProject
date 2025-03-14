import AxiosInstance from "./AxiosInstance";

/**
 * ForumApi.js (Spring Boot Proxy 버전)
 * KR: 이 파일은 프론트엔드와 Spring Boot 백엔드(Flask/ES 프록시)를 연결하는 API 호출 모듈입니다.
 *     각 메서드는 Spring Boot 프록시 엔드포인트에 맞게 HTTP 요청을 전송합니다.
 */
const ForumApi = {
  // ------------------ 카테고리 관련 ------------------

  /**
   * 모든 포럼 카테고리 가져오기
   * 엔드포인트: GET /api/forums/categories/proxy
   * KR: Spring Boot에서 Flask의 카테고리 데이터를 프록시하여 클라이언트에 전달합니다.
   *
   * @returns {Promise} 카테고리 목록 데이터
   */
  fetchCategories: async () => {
    try {
      const response = await AxiosInstance.get("/api/forums/categories");
      console.log("Fetched Categories:", response.data);
      return response.data;
    } catch (error) {
      console.error("포럼 카테고리 가져오기 중 오류:", error);
      throw error;
    }
  },

  /**
   * 카테고리별 게시글 가져오기
   * 엔드포인트: GET /api/forums/posts?categoryId=...&page=...&size=...
   * KR: 지정된 카테고리의 게시글들을 페이지네이션하여 가져옵니다.
   *
   * @param {string} categoryId - 조회할 카테고리 ID
   * @param {number} page - 페이지 번호 (1부터 시작)
   * @param {number} size - 페이지 당 게시글 수
   * @returns {Promise} 게시글 데이터
   */
  getPostsByCategoryId: async (categoryId, page = 1, size = 10) => {
    try {
      const safePage = page < 1 ? 1 : page;
      const response = await AxiosInstance.get("/api/forums/posts", {
        params: { categoryId, page: safePage, size },
      });
      return response.data;
    } catch (error) {
      console.error("카테고리별 게시글 가져오기 중 오류 발생:", error);
      throw error;
    }
  },

  /**
   * 단순 카테고리 조회 (ID로)
   * 엔드포인트: GET /api/forums/categories/{id}
   * KR: 지정된 ID를 가진 카테고리의 기본 정보를 조회합니다.
   *
   * @param {string} categoryId - 조회할 카테고리의 ID
   * @returns {Promise} 카테고리 데이터 (예: { id, name, description, ... })
   */
  getCategoryById: async (categoryId) => {
    try {
      const response = await AxiosInstance.get(
        `/api/forums/categories/${categoryId}`
      );
      return response.data;
    } catch (error) {
      console.error("카테고리 조회 중 오류:", error);
      throw error;
    }
  },

  // ------------------ 게시글(Post) 관련 ------------------
  // (이하 기존 게시글 관련 메서드 동일)
  /**
   * 특정 게시글 상세 정보 가져오기
   * 엔드포인트: GET /api/forums/posts/{postId}
   * KR: 지정된 게시글 ID의 상세 정보를 가져옵니다.
   *
   * @param {string} postId - 게시글 ID
   * @returns {Promise} 게시글 상세 데이터
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
   * 게시글 생성 후 전체 필드 조회까지 수행
   * KR: 새 게시글을 생성하면, 백엔드에서 반환되는 값은 {id, message} 뿐입니다.
   *     게시글의 전체 정보를 얻으려면 생성 후 곧바로 'getPostById'를 호출해야 합니다.
   *
   * @param {object} data - 게시글 생성 데이터
   * @returns {Promise} 생성된 게시글 상세 데이터 (title, content, etc.)
   */
  createPostAndFetch: async (data) => {
    try {
      // 1) 새 게시글 생성
      const createRes = await AxiosInstance.post("/api/forums/posts", data);
      const createData = createRes.data;
      // createData는 { id, message } 형태일 수 있음

      // 2) 생성된 게시글의 id를 이용하여 상세 조회
      //    KR: 이렇게 해야 title, content, category, etc.를 모두 가져올 수 있음
      const detailRes = await AxiosInstance.get(
        `/api/forums/posts/${createData.id}`
      );
      return detailRes.data;
    } catch (error) {
      console.error("게시글 생성(및 상세조회) 중 오류:", error);
      throw error;
    }
  },

  /**
   * 포럼 게시글 생성
   * 엔드포인트: POST /api/forums/posts
   * KR: 게시글 생성 데이터를 Spring Boot 프록시를 통해 전송하여 새 게시글을 만듭니다.
   *
   * @param {object} data - 게시글 생성 데이터
   * @returns {Promise} 생성된 게시글 데이터
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
   * KR: 게시글 제목을 수정합니다.
   *
   * @param {string} postId - 게시글 ID
   * @param {object} data - 수정할 제목 데이터 (예: { title: "새 제목" })
   * @param {number|string} loggedInMemberId - 요청 사용자 ID
   * @param {boolean} isAdmin - 관리자 여부
   * @returns {Promise} 수정된 게시글 데이터
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
   * KR: 게시글 내용을 TipTap JSON 형식으로 수정합니다.
   *
   * @param {string} postId - 게시글 ID
   * @param {object} data - 수정할 내용 데이터 (예: { contentJSON: "..." })
   * @param {number|string} loggedInMemberId - 요청 사용자 ID
   * @param {boolean} isAdmin - 관리자 여부
   * @returns {Promise} 수정된 게시글 데이터
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
   * KR: 게시글을 실제 삭제하지 않고 삭제된 상태로 마킹합니다.
   *
   * @param {string} postId - 게시글 ID
   * @param {number|string} loggedInMemberId - 요청 사용자 ID
   * @param {string} removedBy - 삭제를 수행한 사용자 정보
   * @param {boolean} isAdmin - 관리자 여부
   * @returns {Promise} 삭제 결과
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
   * KR: 관리자가 게시글을 완전히 삭제합니다.
   *
   * @param {string} postId - 게시글 ID
   * @param {number|string} loggedInMemberId - 관리자 사용자 ID
   * @returns {Promise} 하드 삭제 결과
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
   * 엔드포인트: POST /api/forums/posts/{postId}/report
   * KR: 신고자 ID와 신고 사유를 전송하여 게시글 신고를 처리합니다.
   *
   * @param {string} postId - 게시글 ID
   * @param {number} reporterId - 신고자 ID
   * @param {string} reason - 신고 사유
   * @returns {Promise} 신고 처리 결과
   */
  reportPost: async (postId, reporterId, reason) => {
    try {
      const response = await AxiosInstance.post(
        `/api/forums/posts/${postId}/report`,
        { reporterId, reason }
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
   * KR: 삭제되었거나 숨김 처리된 게시글을 복원합니다.
   *
   * @param {string} postId - 게시글 ID
   * @returns {Promise} 복원 처리 결과
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

  /**
   * 게시글 좋아요 토글
   * 엔드포인트: POST /api/forums/posts/{postId}/like
   * KR: 특정 게시글에 대해 좋아요 추가/취소를 수행합니다.
   *
   * @param {string} postId - 게시글 ID
   * @param {number|string} loggedInMemberId - 요청 사용자 ID
   * @returns {Promise} 좋아요 토글 결과
   */
  toggleLikePost: async (postId, loggedInMemberId) => {
    try {
      const response = await AxiosInstance.post(
        `/api/forums/posts/${postId}/like`,
        { memberId: loggedInMemberId }
      );
      return response.data;
    } catch (error) {
      console.error("포럼 게시글 좋아요 토글 중 오류:", error);
      throw error;
    }
  },

  // ------------------ 댓글(Comment) 관련 ------------------
  // 이하 댓글 관련 메서드는 기존 코드와 동일합니다.
  /**
   * 특정 게시글의 댓글 조회
   * 엔드포인트: GET /api/forums/comments/{postId}
   * KR: 지정된 게시글에 속한 모든 댓글을 조회합니다.
   *
   * @param {string} postId - 게시글 ID
   * @returns {Promise} 댓글 목록 데이터
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
   * 댓글 생성
   * 엔드포인트: POST /api/forums/comments
   * KR: 새 댓글 데이터를 전송하여 댓글을 생성합니다.
   *
   * @param {object} data - 댓글 생성 데이터
   * @param {string} [token=""] - (선택) 인증 토큰
   * @returns {Promise} 생성된 댓글 데이터
   */
  addComment: async (data, token = "") => {
    try {
      const response = await AxiosInstance.post("/api/forums/comments", data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data;
    } catch (error) {
      console.error("포럼 댓글 생성 중 오류:", error);
      throw error;
    }
  },

  /**
   * 댓글 수정
   * 엔드포인트: PUT /api/forums/comments/{commentId}?loggedInMemberId=...&isAdmin=...
   * KR: 수정할 댓글의 ID, 새 데이터를, 로그인한 사용자 ID, 관리자 여부를 전달합니다.
   *
   * @param {number} commentId - 댓글 ID
   * @param {object} data - 수정할 댓글 데이터
   * @param {number|string} loggedInMemberId - 요청 사용자 ID
   * @param {boolean} isAdmin - 관리자 여부
   * @returns {Promise} 수정된 댓글 데이터
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
   * 댓글 삭제 (논리 삭제)
   * 엔드포인트: DELETE /api/forums/comments/{commentId}?loggedInMemberId=...&isAdmin=...
   * KR: 댓글을 실제 삭제하지 않고, 삭제된 것으로 마킹합니다.
   *
   * @param {number} commentId - 댓글 ID
   * @param {number|string} loggedInMemberId - 요청 사용자 ID
   * @param {boolean} isAdmin - 관리자 여부
   * @returns {Promise} 삭제 처리 결과
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
   * 댓글 하드 삭제 (관리자 전용)
   * 엔드포인트: DELETE /api/forums/comments/{commentId}/hard-delete?loggedInMemberId=...
   * KR: 관리자가 댓글을 완전히 삭제합니다.
   *
   * @param {number} commentId - 댓글 ID
   * @param {number|string} loggedInMemberId - 관리자 사용자 ID
   * @returns {Promise} 하드 삭제 결과
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
   * 댓글 신고 처리
   * 엔드포인트: POST /api/forums/comments/{commentId}/report
   * KR: 신고자 ID와 신고 사유를 전송하여 댓글 신고를 처리합니다.
   *
   * @param {number} commentId - 댓글 ID
   * @param {number} reporterId - 신고자 ID
   * @param {string} reason - 신고 사유
   * @returns {Promise} 신고 처리 결과
   */
  reportComment: async (commentId, reporterId, reason) => {
    try {
      const response = await AxiosInstance.post(
        `/api/forums/comments/${commentId}/report`,
        { reporterId, reason }
      );
      return response.data;
    } catch (error) {
      console.error("포럼 댓글 신고 중 오류:", error);
      throw error;
    }
  },

  /**
   * 댓글 복원 처리
   * 엔드포인트: POST /api/forums/comments/{commentId}/restore
   * KR: 삭제된 댓글을 복원합니다.
   *
   * @param {number} commentId - 댓글 ID
   * @returns {Promise} 복원 처리 결과
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

  /**
   * 댓글 좋아요 토글
   * 엔드포인트: POST /api/forums/comments/{commentId}/like
   * KR: 댓글에 대해 좋아요 추가/취소를 수행합니다.
   *
   * @param {number} commentId - 댓글 ID
   * @param {number|string} loggedInMemberId - 요청 사용자 ID
   * @returns {Promise} 좋아요 토글 결과
   */
  toggleLikeComment: async (commentId, loggedInMemberId) => {
    try {
      const response = await AxiosInstance.post(
        `/api/forums/comments/${commentId}/like`,
        { memberId: loggedInMemberId }
      );
      return response.data;
    } catch (error) {
      console.error("포럼 댓글 좋아요 토글 중 오류:", error);
      throw error;
    }
  },

  // ------------------ 검색 및 상세 조회 ------------------
  /**
   * 포럼 게시글 검색
   * 엔드포인트: GET /api/forums/search?q=...&type=forum_post&category=...&page=...&size=...
   * KR: 검색어, 카테고리, 페이지, 사이즈를 받아 해당 게시글을 검색합니다.
   *
   * @param {string} q - 검색어
   * @param {string} category - 카테고리 필터
   * @param {number} page - 페이지 번호
   * @param {number} size - 페이지 크기
   * @returns {Promise} 검색 결과 데이터
   */
  search: async (q, category, page, size) => {
    try {
      const safePage = page < 1 ? 1 : page;
      const encodedQ = encodeURIComponent(q);
      // type은 고정으로 forum_post로 설정
      const encodedType = encodeURIComponent("forum_post");
      const categoryParam = category
        ? `&category=${encodeURIComponent(category)}`
        : "";
      const uri = `/api/forums/search?q=${encodedQ}&type=${encodedType}${categoryParam}&page=${safePage}&size=${size}`;
      const response = await AxiosInstance.get(uri);
      return response.data;
    } catch (error) {
      console.error("포럼 게시글 검색 중 오류:", error);
      throw error;
    }
  },

  /**
   * 게시글 상세 조회
   * 엔드포인트: GET /api/forums/posts/{postId}
   * KR: 지정된 게시글 ID의 상세 정보를 조회합니다.
   *
   * @param {string} postId - 게시글 ID
   * @returns {Promise} 게시글 상세 데이터
   */
  detail: async (postId) => {
    try {
      const response = await AxiosInstance.get(`/api/forums/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error("포럼 게시글 상세 조회 중 오류:", error);
      throw error;
    }
  },

  /**
   * 게시글 조회수 증가
   * 엔드포인트: POST /api/forums/posts/{postId}/increment-view
   * KR: 게시글의 조회수를 증가시키기 위해, Spring Boot의 해당 엔드포인트를 호출합니다.
   *
   * @param {string} postId - 게시글 ID
   * @returns {Promise} 조회수 증가 요청의 결과
   */
  incrementViewCount: async (postId) => {
    try {
      // POST 요청을 통해 조회수를 증가시키고 별도의 응답 데이터는 사용하지 않습니다.
      await AxiosInstance.post(`/api/forums/posts/${postId}/increment-view`);
    } catch (error) {
      console.error("게시글 조회수 증가 중 오류:", error);
      throw error;
    }
  },
};

export default ForumApi;
