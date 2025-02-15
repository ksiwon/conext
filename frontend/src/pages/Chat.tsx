// frontend/src/pages/Chat.tsx

import styled from "styled-components";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import SearchTab from "../components/SearchTab";
import ChatList from "../components/ChatList";
import Answer from "../components/Answer";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {  useSelector } from "react-redux";
import { RootState } from "../redux/store";

const apiUrl = process.env.REACT_APP_API_URL;

const socket: Socket = io(apiUrl, {
  transports: ["websocket", "polling"],
  autoConnect: false,
});

interface Message {
  text: string;
  sender: string;
  timestamp: string;
  isSent: boolean;
}

const Chat: React.FC = () => {
  const { role, studentData, teacherData } = useSelector((state: RootState) => state.user);
  const userId = role === "student" ? studentData?.id : teacherData?.id;
  const partnerId = "abc";

  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const sortedUserId = userId ?? "";
  const sortedPartnerId = partnerId ?? "";
  //const roomId = [sortedUserId, sortedPartnerId].sort().join("-");

  useEffect(() => {
    if (!userId || !partnerId) {
      navigate("/", { replace: true });
    }

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => {
        if (!prev.some((msg) => msg.text === message.text && msg.timestamp === message.timestamp)) {
          return [...prev, message];
        }
        return prev;
      });
    };

    const initializeChat = async () => {
      try {
        const response = await axios.get<Message[]>(
          `${apiUrl}/chat/${userId}/${partnerId}`
        );
        setMessages(response.data);

        socket.connect();
        socket.emit("joinRoom", { id1: sortedUserId, id2: sortedPartnerId });

        socket.off("newMessage", handleNewMessage);
        socket.on("newMessage", handleNewMessage);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        //navigate("/", { replace: true });
      }
    };

    initializeChat();

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.emit("leaveRoom", { id1: sortedUserId, id2: sortedPartnerId });
      socket.disconnect();
    };
  }, [userId, partnerId, sortedUserId, sortedPartnerId, navigate]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && userId && partnerId) {
      const message: Message = {
        text: newMessage,
        sender: sortedUserId,
        timestamp: new Date().toISOString(),
        isSent: true,
      };

      try {
        await axios.post(`${apiUrl}/chat/${sortedUserId}/${sortedPartnerId}`, message);
      } catch (error) {
        console.error("Failed to send message via REST API:", error);
      }

      socket.emit("sendMessage", { id1: sortedUserId, id2: sortedPartnerId, ...message });

      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    }
  };

  if (!userId || !partnerId) {
    return null;
  }

  return (
    <GlobalWrapper>
      <Header />
      <WholeWrapper>
        <LeftWrapper>
          <SearchTabWrapper>
            <SearchTab onSearch={(value) => alert(value)} />
          </SearchTabWrapper>
          <ChatList
            username={"장효진"}
            usergrade={"성균관대학교"}
            answerTime={"2025-01-15"}
            answerType={"replied"}
            clicked={true}
          />
          <ChatList
            username={"김지수"}
            usergrade={"서울대학교"}
            answerTime={"2025-01-14"}
            answerType={"replied"}
            clicked={false}
          />
          <ChatList
            username={"박민준"}
            usergrade={"연세대학교"}
            answerTime={"2025-01-13"}
            answerType={"read"}
            clicked={false}
          />
          <ChatList
            username={"최서연"}
            usergrade={"고려대학교"}
            answerTime={"2025-01-15"}
            answerType={"unread"}
            clicked={false}
          />
          <ChatList
            username={"이하늘"}
            usergrade={"KAIST"}
            answerTime={"2025-01-13"}
            answerType={"replied"}
            clicked={false}
          />
          <ChatList
            username={"정하윤"}
            usergrade={"POSTECH"}
            answerTime={"2025-01-12"}
            answerType={"read"}
            clicked={false}
          />
          <ChatList
            username={"김도윤"}
            usergrade={"서울대학교"}
            answerTime={"2025-01-15"}
            answerType={"unread"}
            clicked={false}
          />
          <ChatList
            username={"장은비"}
            usergrade={"연세대학교"}
            answerTime={"2025-01-14"}
            answerType={"replied"}
            clicked={false}
          />
          <ChatList
            username={"이승현"}
            usergrade={"고려대학교"}
            answerTime={"2025-01-13"}
            answerType={"read"}
            clicked={false}
          />
          <ChatList
            username={"한지우"}
            usergrade={"KAIST"}
            answerTime={"2025-01-14"}
            answerType={"unread"}
            clicked={false}
          />
        </LeftWrapper>
        <RightWrapper>
          <ChatHeader>
            <BackUserWrapper>
              <Back onClick={() => navigate(-1)}>
                <i className="fas fa-chevron-left" />
              </Back>
              <UserWrapper>
                <UserSection>장효진</UserSection>
                <UserGrade>성균관대학교 소프트웨어학과 23</UserGrade>
              </UserWrapper>
            </BackUserWrapper>
            <DetailsSection>
              <Answer type={"unread"} />
              <DateText>1시간 전</DateText>
            </DetailsSection>
          </ChatHeader>
          <ChatContent>
            <MessagesWrapper>
              {messages.map((msg, index) => (
                <MessageBubble key={index} isSent={msg.sender === sortedUserId}>
                  <strong>{msg.sender === sortedUserId ? "You" : "Partner"}:</strong> {msg.text}
                </MessageBubble>
              ))}
            </MessagesWrapper>
            <InputWrapper>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <SendButton onClick={handleSendMessage}>전송</SendButton>
            </InputWrapper>
          </ChatContent>
        </RightWrapper>
      </WholeWrapper>
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
      <Footer />
    </GlobalWrapper>
  );
};

export default Chat;

// Styled Components
const GlobalWrapper = styled.div`
display: flex;
flex-direction: column;
height: 100vh;
background-color: ${({ theme }) => theme.colors.gray[100]};
`;

// Styled Components (continued)
const WholeWrapper = styled.div`
display: flex;
flex: 1;
width: 100%;
`;

const LeftWrapper = styled.div`
width: 240px;
display: flex;
flex-direction: column;
background-color: ${({ theme }) => theme.colors.primary};
overflow-y: auto;
`;

const SearchTabWrapper = styled.div`
display: flex;
align-items: center;
justify-content: center;
padding: 16px;
background-color: ${({ theme }) => theme.colors.primary};
box-sizing: border-box;
`;

const RightWrapper = styled.div`
flex: 1;
display: flex;
flex-direction: column;
background-color: ${({ theme }) => theme.colors.white};
`;

const ChatHeader = styled.div`
width: 100%;
height: 92px;
display: flex;
justify-content: space-between;
align-items: center;
padding: 0 16px;
background-color: ${({ theme }) => theme.colors.primary};
box-sizing: border-box;
`;

const BackUserWrapper = styled.div`
display: flex;
align-items: center;
gap: 16px;
box-sizing: border-box;
`;

const Back = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 48px;
height: 48px;
font-size: 24px; /* Adjusted for better icon sizing */
color: ${({ theme }) => theme.colors.white};
cursor: pointer;
`;

const UserWrapper = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: flex-start;
gap: 4px;
`;

const UserSection = styled.div`
font-size: ${({ theme }) => theme.typography.T4.fontSize};
font-weight: ${({ theme }) => theme.typography.T2.fontWeight};
color: ${({ theme }) => theme.colors.white};
`;

const UserGrade = styled.div`
font-size: ${({ theme }) => theme.typography.T6.fontSize};
font-weight: ${({ theme }) => theme.typography.T6.fontWeight};
color: ${({ theme }) => theme.colors.white};
`;

const DetailsSection = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 4px;
`;

const DateText = styled.div`
font-size: ${({ theme }) => theme.typography.T6.fontSize};
font-weight: ${({ theme }) => theme.typography.T7.fontWeight};
color: ${({ theme }) => theme.colors.white};
`;

const ChatContent = styled.div`
flex: 1;
display: flex;
flex-direction: column;
justify-content: space-between;
width: 100%;
`;

const MessagesWrapper = styled.div`
flex: 1;
padding: 16px;
overflow-y: auto;
display: flex;
flex-direction: column;
gap: 8px;
`;

const MessageBubble = styled.div<{ isSent: boolean }>`
max-width: 70%;
padding: 12px;
border-radius: 12px;
background-color: ${({ isSent, theme }) =>
  isSent ? theme.colors.blue[300] : theme.colors.gray[200]};
color: ${({ isSent, theme }) =>
  isSent ? theme.colors.white : theme.colors.black};
align-self: ${({ isSent }) => (isSent ? "flex-end" : "flex-start")};
text-align: ${({ isSent }) => (isSent ? "right" : "left")};
font-size: ${({ theme }) => theme.typography.T6.fontSize};
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
word-break: break-word;
`;

const InputWrapper = styled.div`
display: flex;
padding: 16px;
border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
background-color: ${({ theme }) => theme.colors.gray[100]};
`;

const Input = styled.input`
flex: 1;
padding: 12px;
border: 1px solid ${({ theme }) => theme.colors.gray[400]};
border-radius: 8px;
font-size: ${({ theme }) => theme.typography.T7.fontSize};
outline: none;

&:focus {
  border-color: ${({ theme }) => theme.colors.primary};
}
`;

const SendButton = styled.button`
margin-left: 8px;
padding: 12px 16px;
background-color: ${({ theme }) => theme.colors.primary};
color: ${({ theme }) => theme.colors.white};
border: none;
border-radius: 8px;
font-size: ${({ theme }) => theme.typography.T6.fontSize};
cursor: pointer;
transition: background-color 0.3s ease;

&:hover {
  background-color: ${({ theme }) => theme.colors.blue[600]};
}

&:active {
  transform: scale(0.98);
}
`;
