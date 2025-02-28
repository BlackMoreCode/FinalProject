// src/api/CocktailApi.js
import axios from "axios";

const BASE_URL = "http://localhost:8111";

/**
 * 칵테일 리스트 조회 API 호출 함수 (카테고리 및 페이징 포함)
 * @param {string} query - 검색어
 * @param {string} type - "cocktail" 등
 * @param {string} [category=""] - 카테고리 필터 (없으면 빈 문자열)
 * @param {number} [page=1] - 페이지 번호
 * @param {number} [size=10] - 한 페이지 당 항목 수
 * @returns {Promise} - API 응답 데이터 (JSON 배열)
 *
 * 변경 이유:
 * - 백엔드의 /search 엔드포인트는 검색어를 "q" 파라미터로 받아들이므로,
 *   프론트엔드에서 보내는 검색어의 키를 "q"로 변경해야 합니다.
 */
export const fetchCocktailList = async (
  query,
  type,
  category = "",
  page = 1,
  size = 10
) => {
  try {
    // "query" key를 "q"로 변경하여 백엔드와 일치시킵니다.
    const response = await axios.get(`${BASE_URL}/test/search`, {
      params: { q: query, type, category, page, size },
    });
    return response.data;
  } catch (error) {
    console.error("칵테일 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 칵테일 상세 조회 API 호출 함수
 * @param {string} cocktailId - 칵테일 ID
 * @param {string} [type="cocktail"] - 타입 (기본값: "cocktail")
 * @returns {Promise} - 상세 데이터 (JSON 객체)
 */
export const fetchCocktailDetail = async (cocktailId, type = "cocktail") => {
  try {
    const response = await axios.get(`${BASE_URL}/test/detail/${cocktailId}`, {
      params: { type },
    });
    return response.data;
  } catch (error) {
    console.error("칵테일 상세 조회 실패:", error);
    throw error;
  }
};
