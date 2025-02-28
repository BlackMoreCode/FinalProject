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
const axios_1 = __importDefault(require("axios"));
const Common_1 = __importDefault(require("../util/Common"));
const AuthApi = {
    login: (loginReq) => __awaiter(void 0, void 0, void 0, function* () {
        return yield axios_1.default.get(Common_1.default.BASE_URL + "/auth/login");
    }),
    emailExists: (email) => __awaiter(void 0, void 0, void 0, function* () {
        return yield axios_1.default.get(Common_1.default.BASE_URL + "/auth/exists/" + email);
    }),
    nicknameExists: (nickname) => __awaiter(void 0, void 0, void 0, function* () {
        return yield axios_1.default.get(Common_1.default.BASE_URL + "/auth/nickname/" + nickname);
    }),
    phoneExists: (phone) => __awaiter(void 0, void 0, void 0, function* () {
        return yield axios_1.default.get(Common_1.default.BASE_URL + "/auth/phone/" + phone);
    }),
    signup: (signupReq) => __awaiter(void 0, void 0, void 0, function* () {
        return yield axios_1.default.post(Common_1.default.BASE_URL + "/auth/signup", signupReq);
    }),
    verifySmsToken: (phone, token) => __awaiter(void 0, void 0, void 0, function* () {
        return yield axios_1.default.get(Common_1.default.BASE_URL + `/auth/verifySmsToken/${phone}/${token}`);
    }),
    sendVerificationCode: (phone) => __awaiter(void 0, void 0, void 0, function* () {
        return yield axios_1.default.get(Common_1.default.BASE_URL + "/auth/sendVerificationCode/" + phone);
    })
};
exports.default = AuthApi;
