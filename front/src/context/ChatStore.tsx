import React, {createContext, ReactNode, useState} from "react";
import {AdminMemberResDto, ChartResDto} from "../api/dto/AdminDto";
import {SelectChangeEvent} from "@mui/material";
import {FaqResDto} from "../api/dto/FaqDto";
import {ChatDto} from "../api/dto/ChatDto";

// 상태 값들의 타입 정의
interface ChatContextType {
  page: "list"  | "open" | "bot" | "chat";
  setPage: React.Dispatch<React.SetStateAction<"list" | "open" | "bot" | "chat">>;
  roomId: string;
  setRoomId: (roomId: string) => void;
  chatList: ChatDto[] | null
  setChatList: React.Dispatch<React.SetStateAction<ChatDto[] | null>>;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// ChatContext 생성
export const ChatContext = createContext<ChatContextType | null>(null);

interface ChatStoreProps {
  children: ReactNode;
}

const ChatStore: React.FC<ChatStoreProps> = ({ children }) => {
  const [page, setPage] = useState<"list" | "open" | "bot" | "chat">("list");
  const [roomId, setRoomId] = useState<string>("");
  const [chatList, setChatList] = useState<ChatDto[] | null>(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  return (
    <ChatContext.Provider
      value={{
        page,
        setPage,
        roomId,
        setRoomId,
        chatList,
        setChatList,
        isMenuOpen,
        setIsMenuOpen,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatStore;