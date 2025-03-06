import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFoodList } from "../../api/FoodApi";
import placeholder from "./style/placeholder.jpg";
import placeholder2 from "./style/placeholder2.png";

/**
 * 음식 레시피 목록 페이지
 * - 검색어와 카테고리 필터를 함께 적용할 수 있는 UI 구성
 * - 카테고리를 클릭하면 선택된 카테고리를 state로 저장하고, 검색어와 함께 API를 호출
 * - "전체" 카테고리를 선택하면 빈 문자열("")로 처리하여 필터 해제
 */
const FoodListPage = () => {
  // 음식 레시피 목록 상태
  const [foods, setFoods] = useState([]);
  // 검색어 상태
  const [query, setQuery] = useState("");
  // 선택된 카테고리 상태
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();

  /**
   * 백엔드(Flask)에서 음식 레시피 검색 API 호출
   * @param {string} searchQuery - 검색어 (빈 문자열이면 전체)
   * @param {string} category - 카테고리 필터 (빈 문자열이면 필터 해제)
   */
  const fetchFoods = async (searchQuery, category) => {
    try {
      // API 호출: query, category, page=1, size=20
      const response = await fetchFoodList(searchQuery, category, 1, 20);
      console.log("fetchFoods 응답:", response);
      if (response !== null) {
        setFoods(response);
      }
    } catch (error) {
      console.error("음식 레시피 목록 조회 중 에러:", error);
    }
  };

  /**
   * 레시피 카드를 클릭 시 상세 페이지로 이동
   * @param {string} id - 음식 레시피의 고유 ID
   */
  const handleSelectFood = (id) => {
    navigate(`/foodrecipes/${id}`);
  };

  // 예시 추천 레시피 (실제 데이터에 맞춰 조정)
  const recommendedRecipes = [
    {
      id: "rec_1",
      name: "비빔밥",
      image: placeholder2,
    },
    {
      id: "rec_2",
      name: "김치찌개",
      image: placeholder2,
    },
    {
      id: "rec_3",
      name: "불고기",
      image: placeholder2,
    },
  ];

  // 예시 카테고리 목록 (실제 데이터에 맞춰 조정)
  const categories = ["전체", "반찬", "국&찌개", "일품", "후식"];

  return (
    <div className="px-4 py-8">
      {/* 상단 영역 */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-2 text-kakiBrown dark:text-softBeige">
          Food Recipes
        </h1>
        <p className="text-kakiBrown dark:text-softBeige">
          음식 레시피를 검색하고, 마음에 드는 레시피를 확인해보세요.
        </p>
      </header>

      {/* 검색 바 섹션 */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row max-w-md mx-auto space-y-2 md:space-y-0">
          <input
            type="text"
            placeholder="Search food recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-2 border border-kakiBrown dark:border-darkKaki rounded md:rounded-r-none focus:outline-none"
          />
          <button
            onClick={() => fetchFoods(query, selectedCategory)}
            className="p-2 bg-warmOrange dark:bg-deepOrange text-white rounded md:rounded-l-none hover:bg-orange-600 dark:hover:bg-deepOrange/90"
          >
            Search
          </button>
        </div>
      </section>

      {/* 추천 레시피 섹션 */}
      <section className="mb-16">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-kakiBrown dark:text-softBeige">
          Recipes For You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedRecipes.map((item) => (
            <div
              key={item.id}
              className="border rounded overflow-hidden shadow border-kakiBrown dark:border-darkKaki"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-kakiBrown dark:text-softBeige">
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 카테고리 필터 섹션 */}
      <section className="mb-8 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-kakiBrown dark:text-softBeige">
          원하는 카테고리를 선택하세요
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                const newCat = cat === "전체" ? "" : cat;
                setSelectedCategory(newCat);
                fetchFoods(query, newCat);
              }}
              className={`px-4 py-2 border rounded transition-colors ${
                selectedCategory === cat ||
                (cat === "전체" && selectedCategory === "")
                  ? "bg-warmOrange dark:bg-deepOrange text-white"
                  : "bg-white dark:bg-transparent text-kakiBrown dark:text-softBeige border-kakiBrown dark:border-darkKaki hover:bg-warmOrange dark:hover:bg-deepOrange"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 레시피 목록 섹션 */}
      <section className="mb-16">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-kakiBrown dark:text-softBeige">
          Our Recipes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foods.map((food) => (
            <div
              key={food.id}
              className="border border-kakiBrown dark:border-darkKaki rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer transition-transform transform hover:scale-105"
              onClick={() => handleSelectFood(food.id)}
            >
              <img
                src={food.image || placeholder2}
                alt={food.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-kakiBrown dark:text-softBeige">
                  {food.name}
                </h3>
                <p className="text-kakiBrown dark:text-softBeige">
                  Category: {food.category}
                </p>
                <p className="text-kakiBrown dark:text-softBeige">
                  Likes: {food.like || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FoodListPage;
