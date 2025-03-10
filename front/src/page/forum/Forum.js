import React, { useState, useEffect } from "react";
import ForumApi from "../../api/ForumApi";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReduxApi from "../../api/ReduxApi";
// Redux 관련 모듈 및 로그인 모달 액션 임포트
import { useDispatch } from "react-redux";
import { openModal } from "../../context/redux/ModalReducer";

/**
 * Forum 컴포넌트
 * - 포럼 카테고리를 불러오고, 사용자 정보를 확인합니다.
 * - 사용자 정보가 없으면 로그인 모달을 띄워서 로그인하도록 유도합니다.
 */
const Forum = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 사용자 정보 상태
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  /**
   * 사용자 정보를 가져옵니다.
   * - 성공적으로 정보를 가져오면 상태를 업데이트합니다.
   * - 만약 정보가 없으면, 로그인 모달을 열어 사용자에게 로그인하도록 합니다.
   */
  const fetchMemberData = async () => {
    try {
      const response = await ReduxApi.getMyInfo();
      const userInfo = response.data; // 예: { id, email, nickname, role }
      if (userInfo && userInfo.id) {
        setUserId(userInfo.id);
        setUserData({
          name: userInfo.nickname,
          email: userInfo.email,
          role: userInfo.role,
        });
      } else {
        toast.warning("로그인이 필요합니다.");
        // 로그인 페이지 대신 로그인 모달 열기
        dispatch(openModal("login"));
        return;
      }
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 오류:", error);
      toast.error("사용자 정보를 확인할 수 없습니다.");
      // 오류 발생 시에도 로그인 모달 열기
      dispatch(openModal("login"));
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, []);

  // 카테고리 데이터 상태 및 로딩 상태
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * 백엔드 API를 통해 포럼 카테고리 목록을 가져옵니다.
   */
  const fetchCategories = async () => {
    try {
      const data = await ForumApi.fetchCategories();
      console.log("Fetched Categories:", data);
      setCategories(data);
    } catch (error) {
      console.error("카테고리 목록 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 mt-24 text-kakiBrown dark:text-softBeige">
      {/* 상단 헤더: 포럼 카테고리 제목 및 설명 */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">포럼 카테고리</h1>
        <p className="text-base md:text-lg mb-4">
          자유롭게 소통하고 정보를 나눌 수 있는 게시판을 선택해보세요.
        </p>
        {/* 새 글 작성 버튼 - 클릭 시 별도의 로그인 페이지로 이동하지 않고, 
            이미 로그인 되어 있지 않으면 Forum.js의 fetchMemberData()가 로그인 모달을 열게 됩니다. */}
        <Link
          to="/forum/create-post"
          className="inline-block px-4 py-2 bg-warmOrange dark:bg-deepOrange text-white rounded hover:bg-orange-600 dark:hover:bg-deepOrange/90 transition-colors"
        >
          새 글 작성
        </Link>
      </header>

      {/* 카테고리 목록을 그리드 레이아웃으로 표시 */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/forum/category/${category.id}`}
              state={{ categoryName: category.title }}
              className="block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <h3 className="text-xl font-bold text-blue-600 mb-2">
                {category.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {category.description}
              </p>
              <p className="text-sm text-right text-gray-500 dark:text-gray-400">
                {category.postCount > 0
                  ? `${category.postCount} 개의 게시글이 존재`
                  : "게시글이 아직 없습니다"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Toast 알림 표시 */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Forum;
