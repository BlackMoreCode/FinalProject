import styled from "styled-components";
import { ChatTitle } from "./ChatMenuBar";
import React, { useContext, useEffect, useState } from "react";
import Commons from "../../util/Common";
import { ChatContext } from "../../context/ChatStore";
import {ChatRoomResDto} from "../../api/dto/ChatDto";
import {useSelector} from "react-redux";
import { RootState } from "../../context/Store";
import ChatApi from "../../api/ChatApi";

const ChatListBg = styled.div`
    width: 100%;
    height: 100%;
    //background-color: palegoldenrod;
    background: #FFF;
    padding: 0 30px;
    position: relative;
`
export const ChatUl = styled.ul`
  list-style-type: none;
  padding: 0;
`;
export const ChatRoom = styled.li`
  background-color: #fff;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #e9e9e9;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
`;
export const ChatName = styled.p`
  font-size: 1em;
  margin: 0 0 10px 0;
  color: #444;
`;

const ChatList = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoomResDto[] | null>(null);
    const context = useContext(ChatContext);
    const id = useSelector((state: RootState) => state.user.id);
    if (!context) {
        throw new Error("PostListMain must be used within a Context Provider");
    }
    const {setRoomId, setPage} = context

    // memberId와 관련된 채팅방 목록 가져오기
    const fetchChatRooms = async () => {
        try {
            const rooms = await ChatApi.getMyRooms();
            console.log("Fetched Chat Rooms for Member:", rooms);
            setChatRooms(rooms.data);
        } catch (error) {
            console.error("Error Fetching Chat Rooms for Member:", error);
        }
    };

    // 처음 화면이 나타나는 시점에 서버로부터 정보를 가져옴
    useEffect(() => {
        fetchChatRooms();
    }, [id]);

    // 채팅방 이동
    const enterChatRoom = (roomId : string) => {
        console.log("Room ID:", roomId);
        setRoomId(roomId);
        setPage("chat");
    };

    return (
        <ChatListBg>
            <ChatTitle>채팅</ChatTitle>
            <ChatUl>
                {chatRooms && chatRooms.map((room) => (
                    <ChatRoom key={room.roomId} onClick={() => enterChatRoom(room.roomId)}>
                        <ChatName>{room.name}</ChatName>
                    </ChatRoom>
                ))}
            </ChatUl>
        </ChatListBg>
    );
};
export default ChatList;