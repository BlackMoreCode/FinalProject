import axios from "axios";

const BASE_URL = "http://localhost:8111";

/**
 * 레시피 목록 응답 DTO 인터페이스
 * Food와 Cocktail 모두 공통된 필드를 정의할 수 있습니다.
 * 필요한 필드를 추가하거나 수정하세요.
 */
export interface RecipeListResDto {
  id: string;
  name: string;
  image?: string;
  category?: string;
  like?: number;
  // 추가 필드: 예) abv, ingredients 등
}

/**
 * 레시피 목록 조회 API 호출 함수
 *
 * @param query - 검색어 (없으면 빈 문자열)
 * @param type - "food" 또는 "cocktail"
 * @param category - 카테고리 필터 (없으면 빈 문자열)
 * @param cookingMethod - 조리방법 필터 (음식에만 적용, 칵테일이면 빈 문자열)
 * @param page - 페이지 번호
 * @param size - 한 페이지 당 항목 수
 * @returns Promise<RecipeListResDto[]> - 검색 결과 배열
 */
export const fetchRecipeList = async (
  query: string = "",
  type: string,
  category: string = "",
  cookingMethod: string = "",
  page: number = 1,
  size: number = 10
): Promise<RecipeListResDto[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/recipes/search`, {
      params: { q: query, type, category, cookingMethod, page, size },
    });
    return response.data as RecipeListResDto[];
  } catch (error) {
    console.error("레시피 목록 조회 실패:", error);
    throw error;
  }
};
