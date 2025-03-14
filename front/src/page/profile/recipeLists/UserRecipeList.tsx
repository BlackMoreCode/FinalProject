import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../api/AxiosInstance";

interface Recipe {
  id: string;
  title: string;
  createdAt: string;
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
      const response = await axiosInstance.get(`/api/profile/recipes`, {
        params: { memberId, page, size: 10 },
      });

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

  useEffect(() => {
    fetchRecipes(); // 초기 데이터 로드
  }, []);

  return (
    <div style={{ padding: "20px" }}>
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
            </div>
          ))}
          {loading && <div>Loading...</div>}
        </div>
      )}
      <button
        onClick={fetchRecipes}
        disabled={loading || !hasMore}
        style={{ marginTop: "20px" }}
      >
        {loading ? "Loading..." : "더 보기"}
      </button>
    </div>
  );
};

export default UserRecipesList;
