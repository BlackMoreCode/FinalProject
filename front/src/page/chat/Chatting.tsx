import React, { useEffect, useState, useRef, useContext, useCallback } from "react";
import styled from "styled-components";
import Commons from "../../util/Common";
import { ChatContext } from "../../context/ChatStore";
import ChatApi from "../../api/ChatApi";
import { Change } from "../../context/types";
import {AppDispatch, RootState} from "../../context/Store";
import {useDispatch, useSelector} from "react-redux";
import {BtnBox, OverlayContainer, OverlayContent } from "./OpenChatSearch";
import {setRejectModal} from "../../context/redux/ModalReducer";
import LogoutIcon from '@mui/icons-material/Logout';
import {IconButton, Tooltip} from "@mui/material";
import ListAltIcon from '@mui/icons-material/ListAlt';
import SendIcon from '@mui/icons-material/Send';
import {ProfileImage} from "../profile/style/ProfileStyle";
import {CgProfile} from "react-icons/cg";
import {useNavigate} from "react-router-dom";

const ChattingRoomBg = styled.div`
    width: 100%;
    height: 100%;
    background: #FFF;
    padding: 0 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`;

const ChattingTitle = styled.div`
    width: 100%;
    font-size: 1.15em;
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const ChattingIcon = styled(IconButton)`
`;

const SendButton = styled.img<{ disabled: boolean }>`
    width: 25px;
    aspect-ratio: 1 / 1;
    object-fit: contain;
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};
    filter: ${(props) => (props.disabled ? "grayscale(100%)" : "none")};
`;

const MessagesContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100% - 148px);
    overflow-y: auto;
    transition: height 0.2s ease;
    padding: 10px;
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        height: 30%;
        background: #9f8473;
        border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
        background: #FFF;
        border-radius: 10px;
    }
`;

const MessageBox = styled.div<{ isSender: boolean }>`
    align-self: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
`;

const MsgTime = styled.div<{ isSender: boolean }>`
    display: flex;
    align-items: flex-end;
    gap: 8px;
    margin: 10px 0;
    flex-direction: ${(props) => (props.isSender ? "row-reverse" : "row")};
`;

const Message = styled.div<{ isSender: boolean }>`
    word-break: break-all;
    padding: 10px;
    max-width: 70%;
    border-radius: 20px;
    background-color: ${(props) => (props.isSender ? "#F5F5DC" : "#E0E0E0")};
`;

const Sender = styled.div<{ isSender: boolean }>`
    display: ${(props) => (props.isSender ? "none" : "flex")};
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 40px;  /* 프로필 이미지 크기 */
    height: 40px;  /* 프로필 이미지 크기 */
    padding: 0;
    border-radius: 50%;  /* 원형 이미지 */
    border: 2px solid #D3D3D3;  /* 테두리 색상 (옅은 회색) */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  /* 약간의 그림자 추가 */
    margin: 5px;  /* 여백 */

    &:hover {
        border: 2px solid #A9A9A9;  /* 호버 시 테두리 색상 변경 */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);  /* 호버 시 그림자 강하게 */
        background-color: #F0F0F0;  /* 호버 시 배경 색상 변경 */
    }
`;

const SentTime = styled.div``;

const MsgInput = styled.textarea`
    padding: 5px 10px;
    width: 90%;
    box-sizing: border-box;
    outline-style: none;
    border: none;
    background: none;
    font-size: 1em;
    resize: none;
    max-height: 100px;
    overflow-y: auto;
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        height: 30%;
        background: #9f8473;
        border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
        background: #FFF;
        border-radius: 10px;
    }
`;

const MsgInputBox = styled.div`
    width: 110%;
    padding: 10px;
    border-radius: 10px;
    background-color: #EEE;
    display: flex;
    justify-content: space-between;
    margin: 13px 0;
`;

const ExitMsg = styled.p`
    font-size: 1.1em;
    text-align: center;
`;

const DateSeparator = styled.div`
    text-align: center;
    color: #888;
    font-size: 12px;
    margin: 15px 0;
    font-weight: bold;
`;

const ChattingBottom = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px;
`;

const ChatInput = styled.textarea`
    flex: 1;
    padding: 10px;
    resize: none;
`;

const ChatButton = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const Chatting = () => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [socketConnected, setSocketConnected] = useState<boolean>(false);
    const [inputMsg, setInputMsg] = useState("");
    const [roomName, setRoomName] = useState("");
    const context = useContext(ChatContext);
    const navigate = useNavigate();
    const ws = useRef<WebSocket | null>(null);
    const id = useSelector((state: RootState) => state.user.id);
    const dispatch = useDispatch<AppDispatch>();
    if (!context) {
        throw new Error("PostListMain must be used within a Context Provider");
    }

    const { roomId, setPage, chatList, setChatList } = context;

    useEffect(() => {
        const getChatRoom = async () => {
            try {
                const rsp = await ChatApi.getRoomById(roomId);
                console.log(rsp);
                if (rsp.status === 200 && rsp.data.name) {
                    setRoomName(rsp.data.name);
                } else {
                    dispatch(setRejectModal({message: "채팅방 정보를 불러올 수 없습니다. 이전 페이지로 이동합니다.", onCancel: () => setPage("list")}));
                }
            } catch (error) {
                console.error("Error fetching chat details:", error);
                dispatch(setRejectModal({message: "채팅방 정보를 불러오지 못했습니다.", onCancel: () => setPage("list")}));
            }
        };

        if (roomId) {
            getChatRoom();
        } else {
            console.warn("Invalid roomId : ", roomId);
        }
    }, [roomId]);

    const onChangeMsg: Change = (e) => {
        setInputMsg(e.target.value);
    };

    const onEnterKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && inputMsg.trim() !== "") {
            e.preventDefault();
            onClickMsgSend();
        }
    };

    const onClickExit = () => {
        setPage("list");
    };

    const onClickMsgClose = () => {
        if (ws.current) {
            ws.current.send(
              JSON.stringify({
                  type: "CLOSE",
                  roomId: roomId,
                  memberId: id
              })
            );
            ws.current.close();
        }
        setPage("list");
    };

    useEffect(() => {
        if (!ws.current) {
            console.log("웹소켓 호출")
            ws.current = new WebSocket(Commons.WEBSOCKET_URL);
            ws.current.onopen = () => {
                setSocketConnected(true);
            };
        }

        if (socketConnected) {
            ws.current.send(
              JSON.stringify({
                  type: "ENTER",
                  roomId: roomId,
                  memberId: id,
              })
            );
            loadPreviousChat()
        }

        ws.current.onmessage = msg => {
            const data = JSON.parse(msg.data);
            if (!data.regDate) {
                data.regDate = new Date().toLocaleString();
            }
            console.log(data);

            setChatList(prev => {
                if (!prev) return [data]; // prev가 null이면 새 배열 생성
                if (prev.some(chat => chat.id === data.id)) return prev; // 중복 메시지 방지
                return [...prev, data];
            });
        };
    }, [socketConnected, roomId]);

    const loadPreviousChat = async () => {
        try {
            const rsp = await ChatApi.getMessages(roomId);
            setChatList(rsp.data);
        } catch (error) {
            dispatch(setRejectModal({message: "이전 대화내용을 불러오지 못했습니다.", onCancel: () => setPage("list")}));
        }
    };

    const getKSTDate = () => {
        const date = new Date();
        const offset = 9 * 60 * 60 * 1000;
        return new Date(date.getTime() + offset);
    };

    const onClickMsgSend = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            if (inputMsg.trim() !== "") {
                ws.current.send(
                  JSON.stringify({
                      type: "TALK",
                      roomId: roomId,
                      memberId: id,
                      msg: inputMsg,
                      regDate: getKSTDate()
                  })
                );
                setInputMsg("");
            } else {
                dispatch(setRejectModal({message: "메시지가 비어있습니다.", onCancel: () => setPage("list")}));
                console.log("메시지가 비어있습니다.");
            }
        } else {
            dispatch(setRejectModal({message: "채팅 연결에 실패.", onCancel: () => setPage("list")}));
        }
    };

    const textRef = useRef<HTMLTextAreaElement>(null);
    const handleResizeHeight = useCallback(() => {
        if (textRef.current) {
            textRef.current.style.height = "auto";
            textRef.current.style.height = textRef.current.scrollHeight + "px";
        }
    }, []);

    const ChatContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ChatContainerRef.current) {
            ChatContainerRef.current.scrollTop = ChatContainerRef.current.scrollHeight;
        }
    }, [chatList]);

    const ExitChatRoom = () => {
        setIsOverlayOpen(true);
    };

    const closeOverlay = () => {
        setIsOverlayOpen(false);
    };


    return (
      <ChattingRoomBg>
            <ChattingTitle>
              <Tooltip title="목록으로 가기">
                  <ChattingIcon  onClick={onClickExit}>
                      <ListAltIcon/>
                  </ChattingIcon>
              </Tooltip>
              {roomName}
              <Tooltip title="채팅방 나가기">
                  <ChattingIcon  onClick={ExitChatRoom} >
                      <LogoutIcon/>
                  </ChattingIcon>
              </Tooltip>
          </ChattingTitle>
          <MessagesContainer ref={ChatContainerRef}>
              {chatList?.map((chat, index) => {
                  const currentDate = new Date(chat.regDate).toLocaleDateString();
                  const prevDate = index > 0 ? new Date(chatList[index - 1].regDate).toLocaleDateString() : null;
                  const showDate = currentDate !== prevDate;
                  return (
                    <React.Fragment key={index}>
                        {showDate && <DateSeparator>{new Date(chat.regDate).toLocaleDateString()}</DateSeparator>}
                        <MessageBox isSender={chat.memberId === id}>
                            <Sender isSender={chat.memberId === id} onClick={() => navigate(`/profile/${chat.memberId}`)}>
                                {chat.img ? (
                                  <ProfileImage
                                    src={chat.img}
                                    alt={`${chat.img} 프로필 이미지`}
                                  />
                                ) : (
                                  <CgProfile size={40} color="#9f8473" />
                                )}
                            </Sender>
                            <MsgTime isSender={chat.memberId === id}>
                                <Message isSender={chat.memberId === id}>{chat.msg}</Message>
                                <SentTime>{chat.regDate ? new Date(chat.regDate).toLocaleTimeString().slice(0,-3) : new Date().toLocaleTimeString()}</SentTime>
                            </MsgTime>
                        </MessageBox>
                    </React.Fragment>
                  );
              })}
          </MessagesContainer>
          <MsgInputBox>
              <MsgInput
                ref={textRef}
                placeholder="메세지를 입력해주세요"
                value={inputMsg}
                onChange={onChangeMsg}
                onKeyDown={onEnterKey}
                onInput={handleResizeHeight}
              />
              <ChatButton onClick={onClickMsgSend}>
                  <SendIcon/>
              </ChatButton>
          </MsgInputBox>
          {isOverlayOpen && (
            <OverlayContainer>
                <OverlayContent>
                    <ExitMsg>정말 채팅방을 나가시겠습니까?</ExitMsg>
                    <BtnBox>
                        <button className="cancel" onClick={closeOverlay}>취소</button>
                        <button className="submit" onClick={onClickMsgClose}>확인</button>
                    </BtnBox>
                </OverlayContent>
            </OverlayContainer>
          )}
      </ChattingRoomBg>
    );
};
export default Chatting

