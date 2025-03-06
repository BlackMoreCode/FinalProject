import React, { useState, useEffect } from "react";
import ForumApi from "../../api/ForumApi";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReduxApi from "../../api/ReduxApi";

/**
 * Forum (Tailwind-styled) - Updated to match Cocktail page style
 */
const Forum = () => {
  const navigate = useNavigate();

  // ---------------------------
  // 사용자 정보 로직
  // ---------------------------
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchMemberData = async () => {
    try {
      const response = await ReduxApi.getMyInfo();
      const userInfo = response.data; // { id, email, nickname, role } 등
      if (userInfo && userInfo.id) {
        setUserId(userInfo.id);
        setUserData({
          name: userInfo.nickname,
          email: userInfo.email,
          role: userInfo.role,
        });
      } else {
        toast.warning("로그인이 필요합니다.");
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 오류:", error);
      toast.error("사용자 정보를 확인할 수 없습니다.");
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, []);

  // ---------------------------
  // 카테고리 로딩 로직
  // ---------------------------
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // ---------------------------
  // 컴포넌트 렌더
  // ---------------------------
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 mt-24 text-kakiBrown dark:text-softBeige">
      {/* 상단 헤더 (큰 제목, 간단한 설명) */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">포럼 카테고리</h1>
        <p className="text-base md:text-lg mb-4">
          자유롭게 소통하고 정보를 나눌 수 있는 게시판을 선택해보세요.
        </p>
        {/* 새 글 작성 버튼 */}
        <Link
          to="/forum/create-post"
          className="inline-block px-4 py-2 bg-warmOrange dark:bg-deepOrange text-white rounded hover:bg-orange-600 dark:hover:bg-deepOrange/90 transition-colors"
        >
          새 글 작성
        </Link>
      </header>

      {/* 카테고리 목록 (그리드 레이아웃) */}
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

      {/* Toast 알림 표시용 */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Forum;
