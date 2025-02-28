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
const axios_1 = __importDefault(require("axios"));
const react_router_dom_1 = require("react-router-dom");
const RecipeDetail = () => {
    const [recipe, setRecipe] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const { id, type } = (0, react_router_dom_1.useParams)();
    (0, react_1.useEffect)(() => {
        const fetchRecipe = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`/detail/${id}?type=${type}`);
                setRecipe(response.data);
                setLoading(false);
            }
            catch (err) {
                setError('Failed to fetch recipe details');
                setLoading(false);
            }
        });
        fetchRecipe();
    }, [id, type]);
    if (loading)
        return react_1.default.createElement("div", null, "Loading...");
    if (error)
        return react_1.default.createElement("div", null, error);
    if (!recipe)
        return react_1.default.createElement("div", null, "No recipe found");
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h1", null, recipe.name),
        react_1.default.createElement("img", { src: recipe.ATT_FILE_NO_MAIN, alt: recipe.name }),
        react_1.default.createElement("p", null, recipe.RCP_WAY2),
        react_1.default.createElement("p", null, recipe.RCP_PAT2),
        react_1.default.createElement("ul", null, recipe.ingredients.map((ingredient, index) => (react_1.default.createElement("li", { key: index },
            ingredient.ingredient,
            ": ",
            ingredient.amount)))),
        react_1.default.createElement("div", null, recipe.manuals.map((manual, index) => (react_1.default.createElement("div", { key: index },
            react_1.default.createElement("p", null, manual.text),
            react_1.default.createElement("img", { src: manual.imageUrl, alt: `Step ${index + 1}` })))))));
};
exports.default = RecipeDetail;
