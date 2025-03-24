import axios from "axios";
import Commons from "../util/Common";
import { ChatDto, ChatRoomReqDto, ChatRoomResDto} from "./dto/ChatDto";
import axiosInstance from "./AxiosInstance";

const BASE_URL = Commons.BASE_URL + "/chat"

const chatApi = {
  // 채팅방 생성
  createRoom: async (chatRoomReqDto: ChatRoomReqDto) => {
    return await axiosInstance.post<string>(`${BASE_URL}/new`, chatRoomReqDto, { withCredentials: true });
  },

  // 모든 채팅방 리스트 조회
  getRoomList: async () => {
    return  await axiosInstance.get<ChatRoomResDto[]>(`${BASE_URL}/roomList`, { withCredentials: true });
  },

  // 참여 중인 채팅방 리스트 조회
  getMyRooms: async () => {
    return  await axiosInstance.get<ChatRoomResDto[]>(`${BASE_URL}/myRooms`, { withCredentials: true });
  },

  // 모든 채팅방 조회
  getRooms: async () => {
    return  await axiosInstance.get<ChatRoomResDto[]>(`${BASE_URL}/rooms`, { withCredentials: true });
  },

  // 특정 채팅방 정보 조회
  getRoomById: async (roomId: string) => {
    return  await axiosInstance.get<ChatRoomResDto>(`${BASE_URL}/room/${roomId}`, { withCredentials: true });
  },

  // 채팅방의 현재 참여자 수 조회
  getRoomMemberCount: async (roomId: string) => {
    return  await axiosInstance.get<number>(`${BASE_URL}/cntRoomMember/${roomId}`, { withCredentials: true });
  },

  // 메시지 저장
  saveMessage: async (chatDto: ChatDto) => {
    return  await axiosInstance.post<ChatDto>(`${BASE_URL}/saveMessage`, chatDto, { withCredentials: true });

  },

  // 특정 채팅방의 채팅 내역 조회
  getMessages: async (roomId: string) => {
    return  await axiosInstance.get<ChatDto[]>(`${BASE_URL}/message/${roomId}`, { withCredentials: true });
  },

  // 채팅방 삭제
  deleteRoom: async (roomId: string) => {
    return  await axiosInstance.delete<boolean>(`${BASE_URL}/delRoom/${roomId}`, { withCredentials: true });
  },

  getAi: async (message: string) => {
    return await axios.get<{ title: string, content: string }[]>(`${BASE_URL}/public/bot/${message}`);
  }
};

export default chatApi;