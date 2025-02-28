"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const FoodApi_1 = require("../../api/FoodApi");
const placeholder_jpg_1 = __importDefault(require("./style/placeholder.jpg"));
const placeholder2_png_1 = __importDefault(require("./style/placeholder2.png"));
/**
 * 음식 레시피 목록 페이지
 * - 검색어와 카테고리 필터를 함께 적용할 수 있는 UI 구성
 * - 카테고리를 클릭하면 선택된 카테고리를 state로 저장하고, 검색어와 함께 API를 호출
 * - "전체" 카테고리를 선택하면 빈 문자열("")로 처리하여 필터 해제
 */
const FoodListPage = () => {
    // 음식 레시피 목록 상태
    const [foods, setFoods] = (0, react_1.useState)([]);
    // 검색어 상태
    const [query, setQuery] = (0, react_1.useState)("");
    // 선택된 카테고리 상태
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)("");
    const navigate = (0, react_router_dom_1.useNavigate)();
    /**
     * 백엔드(Flask)에서 음식 레시피 검색 API 호출
     * @param {string} searchQuery - 검색어 (빈 문자열이면 전체)
     * @param {string} category - 카테고리 필터 (빈 문자열이면 필터 해제)
     */
    const fetchFoods = (searchQuery, category) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // API 호출: query, category, page=1, size=20
            const response = yield (0, FoodApi_1.fetchFoodList)(searchQuery, category, 1, 20);
            console.log("fetchFoods 응답:", response);
            if (response !== null) {
                setFoods(response);
            }
        }
        catch (error) {
            console.error("음식 레시피 목록 조회 중 에러:", error);
        }
    });
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
            image: placeholder2_png_1.default,
        },
        {
            id: "rec_2",
            name: "김치찌개",
            image: placeholder2_png_1.default,
        },
        {
            id: "rec_3",
            name: "불고기",
            image: placeholder2_png_1.default,
        },
    ];
    // 예시 카테고리 목록 (실제 데이터에 맞춰 조정)
    const categories = ["전체", "반찬", "국&찌개", "일품", "후식"];
    return (react_1.default.createElement("div", { className: "px-4 py-8" },
        react_1.default.createElement("header", { className: "mb-8" },
            react_1.default.createElement("h1", { className: "text-2xl md:text-4xl font-bold mb-2 text-kakiBrown dark:text-softBeige" }, "Food Recipes"),
            react_1.default.createElement("p", { className: "text-kakiBrown dark:text-softBeige" }, "\uC74C\uC2DD \uB808\uC2DC\uD53C\uB97C \uAC80\uC0C9\uD558\uACE0, \uB9C8\uC74C\uC5D0 \uB4DC\uB294 \uB808\uC2DC\uD53C\uB97C \uD655\uC778\uD574\uBCF4\uC138\uC694.")),
        react_1.default.createElement("section", { className: "mb-12" },
            react_1.default.createElement("div", { className: "flex flex-col md:flex-row max-w-md mx-auto space-y-2 md:space-y-0" },
                react_1.default.createElement("input", { type: "text", placeholder: "Search food recipes...", value: query, onChange: (e) => setQuery(e.target.value), className: "flex-1 p-2 border border-kakiBrown dark:border-darkKaki rounded md:rounded-r-none focus:outline-none" }),
                react_1.default.createElement("button", { onClick: () => fetchFoods(query, selectedCategory), className: "p-2 bg-warmOrange dark:bg-deepOrange text-white rounded md:rounded-l-none hover:bg-orange-600 dark:hover:bg-deepOrange/90" }, "Search"))),
        react_1.default.createElement("section", { className: "mb-16" },
            react_1.default.createElement("h2", { className: "text-xl md:text-2xl font-bold mb-4 text-kakiBrown dark:text-softBeige" }, "Recipes For You"),
            react_1.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, recommendedRecipes.map((item) => (react_1.default.createElement("div", { key: item.id, className: "border rounded overflow-hidden shadow border-kakiBrown dark:border-darkKaki" },
                react_1.default.createElement("img", { src: item.image, alt: item.name, className: "w-full h-40 object-cover" }),
                react_1.default.createElement("div", { className: "p-4" },
                    react_1.default.createElement("h3", { className: "text-lg font-semibold text-kakiBrown dark:text-softBeige" }, item.name))))))),
        react_1.default.createElement("section", { className: "mb-8 text-center" },
            react_1.default.createElement("h2", { className: "text-xl md:text-2xl font-bold mb-4 text-kakiBrown dark:text-softBeige" }, "\uC6D0\uD558\uB294 \uCE74\uD14C\uACE0\uB9AC\uB97C \uC120\uD0DD\uD558\uC138\uC694"),
            react_1.default.createElement("div", { className: "flex flex-wrap justify-center gap-3" }, categories.map((cat) => (react_1.default.createElement("button", { key: cat, onClick: () => {
                    const newCat = cat === "전체" ? "" : cat;
                    setSelectedCategory(newCat);
                    fetchFoods(query, newCat);
                }, className: `px-4 py-2 border rounded transition-colors ${selectedCategory === cat ||
                    (cat === "전체" && selectedCategory === "")
                    ? "bg-warmOrange dark:bg-deepOrange text-white"
                    : "bg-white dark:bg-transparent text-kakiBrown dark:text-softBeige border-kakiBrown dark:border-darkKaki hover:bg-warmOrange dark:hover:bg-deepOrange"}` }, cat))))),
        react_1.default.createElement("section", { className: "mb-16" },
            react_1.default.createElement("h2", { className: "text-xl md:text-2xl font-bold mb-4 text-kakiBrown dark:text-softBeige" }, "Our Recipes"),
            react_1.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" }, foods.map((food) => (react_1.default.createElement("div", { key: food.id, className: "border border-kakiBrown dark:border-darkKaki rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer transition-transform transform hover:scale-105", onClick: () => handleSelectFood(food.id) },
                react_1.default.createElement("img", { src: food.image || placeholder2_png_1.default, alt: food.name, className: "w-full h-48 object-cover" }),
                react_1.default.createElement("div", { className: "p-4" },
                    react_1.default.createElement("h3", { className: "text-lg font-semibold text-kakiBrown dark:text-softBeige" }, food.name),
                    react_1.default.createElement("p", { className: "text-kakiBrown dark:text-softBeige" },
                        "Category: ",
                        food.category),
                    react_1.default.createElement("p", { className: "text-kakiBrown dark:text-softBeige" },
                        "Likes: ",
                        food.like || 0)))))))));
};
exports.default = FoodListPage;
