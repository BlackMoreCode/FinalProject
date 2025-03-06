// src/api/FoodApi.js
import axios from "axios";

// 백엔드 서버 주소 (예: 8111 포트)
const BASE_URL = "http://localhost:8111";

/**
 * 음식 레시피 리스트 조회 API 호출 함수
 * (카테고리 및 페이징 포함)
 *
 * @param {string} query - 검색어 (없으면 빈 문자열로 전달)
 * @param {string} [category=""] - 카테고리 필터 (예: "반찬", "국&찌개" 등)
 * @param {number} [page=1] - 페이지 번호
 * @param {number} [size=10] - 한 페이지 당 항목 수
 * @returns {Promise} - API 응답 데이터 (JSON 배열)
 *
 * FoodController의 /api/foodrecipes/search를 호출함
 */
export const fetchFoodList = async (
  query,
  category = "",
  page = 1,
  size = 10
) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/foodrecipes/search`, {
      params: {
        q: query,
        category,
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    console.error("음식 레시피 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 음식 레시피 상세 조회 API 호출 함수
 *
 * @param {string} foodId - 음식 레시피 문서의 고유 ID
 * @returns {Promise} - 상세 데이터 (JSON 객체)
 *
 * FoodController의 /api/foodrecipes/{id}를 호출함
 */
export const fetchFoodDetail = async (foodId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/foodrecipes/${foodId}`);
    return response.data;
  } catch (error) {
    console.error("음식 레시피 상세 조회 실패:", error);
    throw error;
  }
};
