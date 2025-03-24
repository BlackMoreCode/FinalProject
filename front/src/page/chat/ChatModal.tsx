import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../context/Store";
import { ChatContext } from "../../context/ChatStore";
import ChatMenuBar from "./ChatMenuBar";
import ChatBot from "./ChatBot";
import Chatting from "./Chatting";
import ChatList from "./ChatList";
import OpenChatSearch from "./OpenChatSearch";
import {IconButton, Tooltip} from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const defaultBackgroundColor = "#9aa06";

const Container = styled.div<{ isOpen: boolean }>`
    display: flex;
    flex-direction: column;
    margin: auto;
    position: relative;
    background-color: ${(props) => props.color || defaultBackgroundColor};
`;

const ChatIconBox = styled.div`
    position: fixed;
    cursor: pointer;
    z-index: 990;
    bottom: 30px;
    right: 30px;
    height: 65px;
    @media (max-width: 768px) {
        bottom: 15px;
        right: 15px;
        height: 50px;
    }
`;

const ChatIconButton = styled(IconButton)`
    width: 65px;
    height: 65px;
    @media (max-width: 768px) {
        width: 50px;
        height: 50px;
        font-size: 1.75rem;
    }
    :hover {
        color: #8e735f;
    }
`;

const SelectPage = styled.div`
    width: 100%;
    height: calc(100% - 50px);
    flex: 1;
    position: relative;
    overflow-y: auto;
`;

const StyledSideMenu = styled.div<{ isOpen: boolean }>`
    position: fixed;
    right: 30px;
    bottom: 60px;
    width: 400px;
    aspect-ratio: 4 / 7;
    background-color: #fff;
    border-radius: 30px;
    box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
    transform: ${(props) => (props.isOpen ? "translateY(-10%)" : "translateY(0)")};
    opacity: ${(props) => (props.isOpen ? "1" : "0")};
    z-index: ${(props) => (props.isOpen ? "100" : "-1")};
    transition: 0.5s ease;
    overflow: hidden;
    @media (max-width: 768px) {
        right: 15px;
        bottom: 30px;
        width: 50%;
        height: calc(100dvh - 190px);
        max-height: 800px;
    }
`;

const ChatModal = () => {
    const guest = useSelector((state: RootState) => state.user.guest);
    const context = useContext(ChatContext);

    if (!context) {
        throw new Error("ChatMain must be used within a Context Provider");
    }

    const { page, setPage, isMenuOpen, setIsMenuOpen } = context;

    // isMenuOpen 상태 변경을 추적하고 페이지를 변경하는 useEffect
    useEffect(() => {
        if (isMenuOpen && !guest) {
            setPage("list");
        }
    }, [isMenuOpen, guest, setPage]);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const renderPage = () => {
        switch (page) {
            case "list":
                return <ChatList />;
            case "open":
                return <OpenChatSearch />;
            case "bot":
                return <ChatBot />;
            case "chat":
                return <Chatting />;
            default:
                return null;
        }
    };

    return (
      <Container isOpen={isMenuOpen}>
          <ChatIconBox onClick={toggleMenu}>
              {isMenuOpen ? (
                <Tooltip title="닫기">
                    <ChatIconButton>
                        <CloseIcon sx={{fontSize: "2rem", color: "#9f8473"}}/>
                    </ChatIconButton>
                </Tooltip>
              ) : (
                <Tooltip title="채팅방">
                  <ChatIconButton>
                    <ChatIcon sx={{fontSize: "2rem", color: "#9f8473"}}/>
                  </ChatIconButton>
                </Tooltip>
              )}
          </ChatIconBox>
          <StyledSideMenu isOpen={isMenuOpen}>
              <SelectPage>{renderPage()}</SelectPage>
              <ChatMenuBar />
          </StyledSideMenu>
      </Container>
    );
};

export default ChatModal;
