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
const CocktailApi_1 = require("../../api/CocktailApi");
const placeholder2_png_1 = __importDefault(require("./style/placeholder2.png"));
/**
 * 칵테일 상세 페이지
 * <p>URL 파라미터(:id)를 사용하여 백엔드로부터 상세 정보를 가져오고, 화면에 표시</p>
 */
const CocktailDetailPage = () => {
    const [cocktail, setCocktail] = (0, react_1.useState)(null);
    const { id } = (0, react_router_dom_1.useParams)(); // URL 파라미터에서 id 추출
    const navigate = (0, react_router_dom_1.useNavigate)(); // 뒤로 가기 등에 사용
    (0, react_1.useEffect)(() => {
        const fetchDetail = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const data = yield (0, CocktailApi_1.fetchCocktailDetail)(id);
                console.log("Detail data received:", data);
                setCocktail(data);
            }
            catch (error) {
                console.error("칵테일 상세 조회 실패:", error);
                // Optionally set an error state to display a message on the UI
            }
        });
        fetchDetail();
    }, [id]);
    if (!cocktail) {
        return react_1.default.createElement("div", { className: "text-center mt-8" }, "Loading...");
    }
    // ingredients가 배열이 아닐 수도 있으므로 안전하게 처리
    const ingredients = Array.isArray(cocktail.ingredients)
        ? cocktail.ingredients
        : [];
    return (react_1.default.createElement("div", { className: "max-w-4xl mx-auto p-4" },
        react_1.default.createElement("button", { onClick: () => navigate(-1), className: "mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300" }, "Back to list"),
        react_1.default.createElement("h1", { className: "text-3xl font-bold mb-4" }, cocktail.name),
        react_1.default.createElement("img", { src: cocktail.image || placeholder2_png_1.default, alt: cocktail.name, className: "w-full h-64 object-cover rounded-lg mb-4" }),
        react_1.default.createElement("div", { className: "mb-4" },
            react_1.default.createElement("p", { className: "text-gray-700" },
                react_1.default.createElement("span", { className: "font-semibold" }, "Category:"),
                " ",
                cocktail.category),
            react_1.default.createElement("p", { className: "text-gray-700" },
                react_1.default.createElement("span", { className: "font-semibold" }, "Description:"),
                " ",
                cocktail.description),
            react_1.default.createElement("p", { className: "text-gray-700" },
                react_1.default.createElement("span", { className: "font-semibold" }, "ABV:"),
                " ",
                cocktail.abv),
            react_1.default.createElement("p", { className: "text-gray-700" },
                react_1.default.createElement("span", { className: "font-semibold" }, "Garnish:"),
                " ",
                cocktail.garnish)),
        react_1.default.createElement("h3", { className: "text-2xl font-semibold mb-2" }, "Ingredients"),
        react_1.default.createElement("ul", { className: "list-disc ml-6" }, ingredients.map((ing, index) => (react_1.default.createElement("li", { key: index, className: "text-gray-700" },
            ing.ingredient,
            " - ",
            ing.amount,
            " ",
            ing.unit,
            " ",
            ing.special && `(${ing.special})`))))));
};
exports.default = CocktailDetailPage;
