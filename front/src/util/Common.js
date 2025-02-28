"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment")); // 시간을 경과 시간 형태로 표시
require("moment/locale/ko");
moment_1.default.locale("ko"); // 한국 시간 적용
const Commons = {
    BASE_URL: "http://localhost:8111",
    WEBSOCKET_URL: "ws://localhost:8111/ws/chat",
    timeFromNow: (timestamp) => {
        return (0, moment_1.default)(timestamp).fromNow();
    },
    formatDateAndTime: (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adds leading 0 if needed
        const day = ("0" + date.getDate()).slice(-2);
        const hour = ("0" + date.getHours()).slice(-2);
        const minute = ("0" + date.getMinutes()).slice(-2);
        return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
    },
    formatDate: (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adds leading 0 if needed
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    },
    formatTime: (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    }
};
exports.default = Commons;
