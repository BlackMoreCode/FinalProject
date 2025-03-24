import styled from "styled-components";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatStore";
import {useDispatch} from "react-redux";
import ChatApi from "../../api/ChatApi";
import {ChatRoomReqDto, ChatRoomResDto} from "../../api/dto/ChatDto";
import {setRejectModal} from "../../context/redux/ModalReducer";
import { AppDispatch } from "../../context/Store";
import { ChatTitle } from "./ChatMenuBar";
import {ChatName, ChatRoom, ChatUl } from "./ChatList";

const OpenChatBg = styled.div`
    width: 100%;
    height: 100%;
    /* background-color: pink; */
    background: #FFF;
    padding: 0 30px;
    position: relative;
`
const CreateBtn = styled.button`
    width: 25%;
    padding: 7px;
    border-radius: 10px;
    border: 1px solid #777;
    background-color: #FFF;
    &:hover {
        color: #FFF;
        background-color: #6154D4;
        border: 1px solid #6154D4;
    }
`
const SearchBox = styled.div`
    width: 100%;
    border: 1px solid #777;
    border-radius: 30px;
    background-color: #FFF;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`
const SearchInput = styled.input`
    width: calc(100% - 30px);
    padding: 10px 15px;
    outline-style: none;
    border: none;
    background: none;
`
const SearchIcon = styled.img`
    width: 15px;
    filter: grayscale(100%);
    cursor: pointer;
    &:hover {
        filter: none;
    }
`
const CreateInputBox = styled.div`
    width: 100%;
    border-bottom: 1px solid #777;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const Input = styled.input`
    width: 70%;
    padding: 10px;
    outline-style: none;
    border: none;
`;
const Max = styled.p`

`
const ModalText = styled.p`
    margin: 10px 0;
`;


const CreateTitle = styled.div`
    width: 100%;
    font-size: 1.1em;
    /* padding: 15px 0; */
    display: flex;
    align-items: center;
    justify-content: space-between;
`
export const OverlayContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const OverlayContent = styled.div`
    width: 80%;
    /* height: 50%; */
    background-color: white;
    border-radius: 30px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    padding: 40px 20px;
`;
export const BtnBox = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: space-evenly;
    button {
        width: 60px;
        height: 35px;
        border-radius: 10px;
        border: none;
        background-color: #FFF;
    }
    .cancel { border: 2px solid #E0CEFF; }
    .cancel:hover { background-color: #E0CEFF; }
    .submit { border: 2px solid #6154D4; }
    .submit:hover { background-color: #6154D4; color: #FFF; }
`

const OpenChatSearch = () => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false); // Overlay 상태 관리
    const [isOverMemberOpen, setIsOverMemberOpen] = useState(false);
    const [chatRooms, setChatRooms] = useState<ChatRoomResDto[] | null>(null);


    const [filteredChatRooms, setFilteredChatRooms] = useState<ChatRoomResDto[] | null>(null);
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

    const [personCnt, setPersonCnt] = useState<number>(5);
    const [chatRoomTitle, setChatRoomTitle] = useState<string>("");
    const dispatch = useDispatch<AppDispatch>();
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error("PostListMain must be used within a Context Provider");
    }

    const {setRoomId, setPage} = context

    // 서버로부터 채팅방 목록을 가져오는 API
    const fetchChatRooms = async() => {
        try {
            const rsp = await ChatApi.getRoomList();
            console.log(rsp);
            if (rsp.status === 200) {
                setChatRooms(rsp.data);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchChatRooms();
    }, []); // 처음 화면이 나타나는 시점에 서버로부터 정보를 가져옴

    // 채팅방 개설을 위한 axios 호출
    const handleCreateChatRoom = async() => {
        if (chatRoomTitle.length === 0) {
            dispatch(setRejectModal({message: "채팅방 이름을 입력해주세요.", onCancel:null}));
            return;
        } else if (chatRoomTitle.length > 20) {
            dispatch(setRejectModal({message: "채팅방 이름은 최대 20자입니다.", onCancel:null}));
            return;
        }
        if (personCnt === 0 || isNaN(personCnt) || personCnt <= 1 || personCnt > 30) {
            dispatch(setRejectModal({message: "참여 가능 인원은 최소 2명 최대 30명입니다.", onCancel:null}));
            return;
        }
        try {
            const req : ChatRoomReqDto = {
                name: chatRoomTitle,
                roomType: "GROUP",
                personCnt: personCnt
            }
            const rsp = await ChatApi.createRoom(req);
            console.log(rsp);
            setRoomId(rsp.data);
            setPage("chat");
        } catch (e) {
            dispatch(setRejectModal({message: "통신에 실패했습니다.", onCancel:null}));
        }
    };

    // 채팅방 이동
    const enterChatRoom = async (roomId: string) => {
        try {
            const currentMembers = await ChatApi.getRoomMemberCount(roomId);
            const chatDetails = await ChatApi.getRoomById(roomId);
            console.log(chatDetails, currentMembers);
            const personCnt = chatDetails.data.personCnt;
            if (currentMembers.data >= personCnt) {
                setIsOverMemberOpen(true);
                return; // 입장 불가
            }
            setRoomId(roomId);
            setPage("chat");
        } catch (error) {
            console.error("Error fetching chat room details:", error);
            throw error;
        }
    };

    const createChatRoom = () => {
        setIsOverlayOpen(true);
    };

    const overMember = () => {
        setIsOverMemberOpen(false);
    };

    const closeOverlay = () => {
        setIsOverlayOpen(false);
    };

    const closeOverMember = () => {
        setIsOverMemberOpen(false);
    }

    // 채팅방 검색
    const handleSearch = () => {
        const filteredRooms = chatRooms && chatRooms.filter(room =>
            room.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredChatRooms(filteredRooms);
    };

    return (
        <OpenChatBg>
            <ChatTitle>오픈 채팅
                <CreateBtn onClick={createChatRoom}>+ 만들기</CreateBtn>
            </ChatTitle>
            <SearchBox>
                <SearchInput
                    placeholder="오픈 채팅방 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon src={"https://firebasestorage.googleapis.com/v0/b/uniguide-3d422.firebasestorage.app/o/firebase%2Fchaticon%2Fsearch.svg?alt=media"} alt="Search" onClick={handleSearch}/>
            </SearchBox>
            <ChatUl>
                {filteredChatRooms ? filteredChatRooms.map((room) => (
                    <ChatRoom key={room.roomId} onClick={() => enterChatRoom(room.roomId)}>
                        <ChatName>{room.name}</ChatName>
                    </ChatRoom>
                )) :
                  chatRooms && chatRooms.map((room) => (
                    <ChatRoom key={room.roomId} onClick={() => enterChatRoom(room.roomId)}>
                        <ChatName>{room.name}</ChatName>
                    </ChatRoom>
                  ))}
            </ChatUl>
            {isOverlayOpen && (
                <OverlayContainer>
                    <OverlayContent>
                        <CreateTitle>오픈 채팅방 만들기</CreateTitle>
                        <CreateInputBox>
                            <Input
                                type="text"
                                value={chatRoomTitle}
                                placeholder="채팅방 이름"
                                onChange={(e) => setChatRoomTitle(e.target.value)}
                            />
                            <Max>최대 20자</Max>
                        </CreateInputBox>
                        <CreateInputBox>
                            <Input
                                type="number"
                                value={personCnt}
                                placeholder="참여 가능 인원"
                                onChange={(e) => setPersonCnt(Number(e.target.value))} // 숫자로 변환
                            />
                            <Max>최대 30명</Max>
                        </CreateInputBox>
                        <BtnBox>
                            <button className="cancel" onClick={closeOverlay}>취소</button>
                            <button className="submit" onClick={handleCreateChatRoom}>확인</button>
                        </BtnBox>
                    </OverlayContent>
                </OverlayContainer>
            )}
            {isOverMemberOpen && (
                <OverlayContainer>
                    <OverlayContent>
                        <CreateTitle>최대 입장 인원을 초과하였습니다.</CreateTitle>
                        <BtnBox>
                            <button className="submit" onClick={closeOverMember}>확인</button>
                        </BtnBox>
                    </OverlayContent>
                </OverlayContainer>
            )}
        </OpenChatBg>
    );
};
export default OpenChatSearch;