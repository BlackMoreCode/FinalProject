import styled from "styled-components";
import { useState, ChangeEvent, useEffect } from "react";
import ChatApi from "../../api/ChatApi";
import React from "react";

const ChattingRoomBg = styled.div`
  width: 100%;
  height: 100%;
  background: #FFF;
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  position: relative;
`;

const ChattingTitle = styled.div`
    width: 100%;
    font-size: 1.15em;
    padding: 30px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
`;

const MessagesContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100% - 148px);
    overflow-y: auto;
    padding: 10px;
`;

const MessageBoxContainer = styled.div<{ isSender: boolean }>`
    align-self: ${(props) => (props.isSender ? "flex-end" : "flex-start")};
    margin: 5px 0;
`;

const Message = styled.div<{ isSender: boolean }>`
    padding: 10px;
    max-width: 70%;
    border-radius: 20px;
    background-color: ${(props) => (props.isSender ? "#F5F5DC" : "#E0E0E0")};
    border: 1px solid ${(props) => (props.isSender ? "#F5F5DC" : "#E0E0E0")};
`;

const MsgInputBox = styled.div`
    width: 100%;
    padding: 10px;
    background-color: #EEE;
    display: flex;
    justify-content: space-between;
    border-radius: 10px;
    margin: 10px 0;
`;

const MsgInput = styled.textarea`
    flex: 1;
    padding: 10px;
    border: none;
    background: none;
    font-size: 1em;
    resize: none;
    outline: none;
    overflow-y: auto;
`;

const SendButton = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
    
`;
const ResponseContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const QuestionContainer = styled.div`
    font-weight: bold;
    font-size: 1.2em;
    color: #333;
    margin-bottom: 8px;
`;

const TitleContainer = styled.div`
    font-size: 1.3em;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 8px;
`;

const ContentContainer = styled.div`
    font-size: 1.05em;
    color: #555;
    line-height: 1.6;
    white-space: pre-line;
    word-wrap: break-word;
    margin-top: 10px;
`;


const ChatBot = () => {
  const [chat, setChat] = useState<string | null>(null);
  const [response, setResponse] = useState<{ title: string, content: string }[] | null>(null);
  const [message, setMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (response && response.length > 0 && currentIndex < response.length) {
      setDisplayedText(response[currentIndex].content[0]);

      const interval = setInterval(() => {
        setDisplayedText((prevText) => {
          const nextIndex = prevText.length;
          if (nextIndex < response[currentIndex].content.length) {
            return prevText + response[currentIndex].content[nextIndex];
          } else {
            clearInterval(interval);
            return prevText;
          }
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [currentIndex, response]);

  const onClickSendChat = async () => {
    if (!message.trim()) return;
    setChat(message);
    setMessage("");
    try {
      const rsp = await ChatApi.getAi(message);
      setResponse(rsp.data);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error fetching message: ", error);
    }
  };

  const onNextResponse = () => {
    setCurrentIndex((prev) => (response && prev < response.length ? prev + 1 : prev));
  };

  return (
    <ChattingRoomBg>
      <ChattingTitle>AI 챗봇</ChattingTitle>
      <MessagesContainer>
        {chat && <MessageBoxContainer isSender={true}>
          <Message isSender={true}>{chat}</Message>
        </MessageBoxContainer>}
        {response && response.length > 0 && (
          <MessageBoxContainer isSender={false}>
            <Message isSender={false}>
              {currentIndex < response.length ?
                <ResponseContainer>
                  <QuestionContainer>
                    {chat}의 결과를 찾아보았어요
                  </QuestionContainer>
                  <TitleContainer>
                    {response[currentIndex].title}
                  </TitleContainer>
                  <ContentContainer>
                    {displayedText}
                  </ContentContainer>
                </ResponseContainer>
                : "죄송합니다. 제가 이해하지 못했네요."}
            </Message>
            {currentIndex < response.length  && (
              <SendButton onClick={onNextResponse}>다음 응답</SendButton>
            )}
          </MessageBoxContainer>
        )}
      </MessagesContainer>
      <MsgInputBox>
        <MsgInput
          value={message}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <SendButton onClick={onClickSendChat}>전송</SendButton>
      </MsgInputBox>
    </ChattingRoomBg>
  );
};

export default ChatBot;