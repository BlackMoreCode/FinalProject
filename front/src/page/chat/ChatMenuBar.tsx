import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { ChatContext } from "../../context/ChatStore";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../context/Store";
import { setRejectModal } from "../../context/redux/ModalReducer";
import { IconButton } from "@mui/material";
import ListAltIcon from '@mui/icons-material/ListAlt';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export const ChatTitle = styled.h2`
    width: 100%;
    padding: 30px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const ChatNavBar = styled.div`
    position: absolute;
    width: 100%;
    height: 50px;
    bottom: 0;
    background-color: rgba(245, 245, 220, 0.5); /* 배경색은 그대로 유지 */
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`;

const IconSvg = styled(IconButton)<{ is: boolean }>`
    &:hover {
        svg {
            color: ${(props) => (props.is ? "#C2B280" : "#A0A0A0")}; /* 호버 시 색상 변경 */
        }
    }
`;

const ChatMenuBar = () => {
  const context = useContext(ChatContext);
  const guest = useSelector((state: RootState) => state.user.guest);
  const dispatch = useDispatch<AppDispatch>();
  if (!context) {
    throw new Error("PostListMain must be used within a Context Provider");
  }

  const { page, setPage } = context;

  useEffect(() => {
    if (guest && page !== "bot") {
      setPage("bot");
    }
  }, [page, guest]);

  const onClickNavigate = (InputPage: "list" | "open" | "bot") => {
    if (guest && InputPage !== "bot") {
      dispatch(setRejectModal({ message: "비회원은 챗봇만 사용가능 합니다.", onCancel: null }));
      setPage("bot");
      return;
    }
    setPage(InputPage);
  };

  return (
    <ChatNavBar>
      <IconSvg is={page === "list" || page === "chat"} onClick={() => onClickNavigate("list")}>
        <ListAltIcon sx={{ color: page === "list" || page === "chat" ? "#C2B280" : "#8B8B8B" }} />
      </IconSvg>
      <IconSvg is={page === "open"} onClick={() => onClickNavigate("open")}>
        <ManageSearchIcon sx={{ color: page === "open" ? "#C2B280" : "#8B8B8B" }} />
      </IconSvg>
      <IconSvg is={page === "bot"} onClick={() => onClickNavigate("bot")}>
        <SmartToyIcon sx={{ color: page === "bot" ? "#C2B280" : "#8B8B8B" }} />
      </IconSvg>
    </ChatNavBar>
  );
};

export default ChatMenuBar;
