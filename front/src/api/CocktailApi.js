// src/api/CocktailApi.js
import axios from "axios";

const BASE_URL = "http://localhost:8111";

/**
 * 칵테일 리스트 조회 API 호출 함수
 * - /api/cocktails/search?q=...&category=...&page=...&size=...
 *
 * @param {string} query - 검색어
 * @param {string} category - 카테고리 필터 (없으면 "")
 * @param {number} [page=1] - 페이지 번호
 * @param {number} [size=10] - 한 페이지 당 항목 수
 * @returns {Promise} - API 응답 데이터 (JSON 배열)
 */
export const fetchCocktailList = async (
  query = "",
  category = "",
  page = 1,
  size = 10
) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/cocktails/search`, {
      params: {
        q: query,
        category: category,
        page: page,
        size: size,
      },
    });
    return response.data;
  } catch (error) {
    console.error("칵테일 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 칵테일 상세 조회 API 호출 함수
 * - /api/cocktails/{id}
 *
 * @param {string} cocktailId - 칵테일 ID
 * @returns {Promise} - 상세 데이터 (JSON 객체)
 */
export const fetchCocktailDetail = async (cocktailId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/cocktails/${cocktailId}`);
    return response.data;
  } catch (error) {
    console.error("칵테일 상세 조회 실패:", error);
    throw error;
  }
};
