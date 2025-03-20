import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../api/AxiosInstance";
import ProfileApi from "../../../api/ProfileApi";

interface Recipe {
  id: string;
  title: string;
  createdAt: string;
  content_type: string; // content_type 필드 추가
}

interface Props {
  memberId: string;
}

const UserRecipesList: React.FC<Props> = ({ memberId }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 데이터를 가져오는 함수
  const fetchRecipes = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const response = await ProfileApi.getUserRecipes(memberId, page, 10); // ProfileApi로 변경
      const newRecipes: Recipe[] = response.data;

      setRecipes((prev) => [...prev, ...newRecipes]); // 기존 데이터에 추가
      setHasMore(newRecipes.length > 0); // 데이터가 있으면 계속 로드 가능
      setPage((prev) => prev + 1); // 다음 페이지 번호 증가
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  }, [memberId, page, hasMore, loading]);

  // 페이지 로딩 시 데이터 가져오기
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]); // fetchRecipes가 변경될 때마다 호출

  // 스크롤 이벤트를 사용하여 더보기 기능 구현 (무한 스크롤)
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const bottom =
      e.currentTarget.scrollHeight ===
      e.currentTarget.scrollTop + e.currentTarget.clientHeight;
    if (bottom && hasMore && !loading) {
      fetchRecipes(); // 스크롤이 끝까지 내려가면 추가 데이터 불러오기
    }
  };

  return (
    <div
      style={{ padding: "20px", height: "400px", overflowY: "auto" }}
      onScroll={handleScroll}
    >
      {recipes.length === 0 ? (
        <p>작성된 레시피가 없습니다.</p>
      ) : (
        <div>
          {recipes.map((item) => (
            <div
              key={item.id}
              style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
            >
              <h3>{item.title}</h3>
              <p>{item.createdAt || "N/A"}</p>
              <p>{item.content_type || "N/A"}</p> {/* content_type 추가 */}
            </div>
          ))}
          {loading && <div>Loading...</div>}
        </div>
      )}
      {/* 기존 버튼 방식 사용도 가능 */}
      {/* <button
        onClick={fetchRecipes}
        disabled={loading || !hasMore}
        style={{ marginTop: "20px" }}
      >
        {loading ? "Loading..." : "더 보기"}
      </button> */}
    </div>
  );
};

export default UserRecipesList;
