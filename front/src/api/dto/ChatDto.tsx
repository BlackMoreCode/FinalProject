export interface ChatRoomReqDto {
  name: string;
  roomType: "GROUP" | "PRIVATE";
  personCnt: number;
}

export interface ChatDto {
  type: "ENTER" | "TALK" | "CLOSE"
  id: number;
  roomId: string;
  memberId: number;
  msg: string;
  regDate: string;
  img: string;
}

export interface ChatRoomResDto {
  roomId: string;
  name: string;
  regDate: string; // LocalDateTime을 문자열로 처리
  roomType: "GROUP" | "DIRECT"; // ChatRoomType(enum) 대체
  personCnt: number;
}

