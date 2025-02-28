"use strict";
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
const AxiosInstance_1 = __importDefault(require("./AxiosInstance"));
const Common_1 = __importDefault(require("../util/Common"));
const API_BASE_URL = Common_1.default.BASE_URL + "/hook";
const ReduxApi = {
    getMyInfo: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield AxiosInstance_1.default.get(API_BASE_URL + "/myinfo");
    })
};
exports.default = ReduxApi;
