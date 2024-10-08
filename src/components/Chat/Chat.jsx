/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import classNames from "classnames/bind";
import styles from "./Chat.module.scss";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { chathubConnection } from "../../services/signalrService";
import * as signalR from "@microsoft/signalr";
import ChatBody from "./ChatBody";
import ChatBox from "./ChatBox";
import EmojiPicker from "emoji-picker-react";
import ChatHeader from "./ChatHeader";
import { Box, ClickAwayListener } from "@mui/material";

const cx = classNames.bind(styles);

const Chat = ({ setIsShowChat, isShowChat, userLogin }) => {
  const [message, setMessage] = useState({
    content: "",
    type: "text",
  });
  const [messages, setMessages] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [conversation, setConversation] = useState("");
  const [isShowEmoji, setIsShowEmoji] = useState(false);
  const [adminStatus, setAdminStatus] = useState(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isAdminPreparing, setIsAdminPreparing] = useState(false);

  const handleSendMessage = async (e) => {
    if (
      (e.type === "click" || (e.type === "keydown" && e.keyCode === 13)) &&
      message.content
    )
      try {
        const messageDto = {
          messageId: null,
          senderId: userLogin.id,
          conversationId: conversation,
          messageContent: message.content,
          messageType: message.type,
          originalMessageId: null,
        };
        await chathubConnection.invoke(
          "SendMessageAsync",
          admin?.userId,
          messageDto
        );
        setMessage({
          content: "",
          type: "text",
        });
        setIsShowEmoji(false);
      } catch (error) {
        console.log(error);
      }
  };

  const handleChooseEmoji = (emojiObj, e) => {
    setMessage((prevMessage) => {
      return {
        ...prevMessage,
        content: `${prevMessage.content}${emojiObj.emoji}`,
      };
    });
  };

  useLayoutEffect(() => {
    chathubConnection.on("ReceiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    chathubConnection.on("ReceiveAdmin", (currentAdmin, conversationId) => {
      setConversation(conversationId);
      setAdmin(currentAdmin);
    });

    chathubConnection.on("ReceiveStatus", (adminId, status) => {
      setAdminStatus({
        adminId,
        status,
      });
    });

    if (chathubConnection.state === signalR.HubConnectionState.Disconnected) {
      chathubConnection
        .start()
        .then(() => {
          console.log("ChatHub connected successfully.");
        })
        .catch((err) => {
          console.error("Error connecting to ChatHub:", err);
        });
    }
    return () => {
      if (chathubConnection.state === signalR.HubConnectionState.Connected) {
        chathubConnection
          .stop()
          .then(() => console.warn("ChatHub disconnected successfully."))
          .catch((err) => console.error("Error disconnected to ChatHub:", err));
      }
    };
  }, []);

  useEffect(() => {
    chathubConnection.on("ReceivePreparing", (isPrepare) => {
      setIsAdminPreparing(isPrepare);
    });
  }, []);

  useEffect(() => {
    if (
      (isShowChat || conversation) &&
      chathubConnection.state === signalR.HubConnectionState.Connected
    ) {
      chathubConnection
        .invoke("GetMessagesAsync", "[0,14]", conversation)
        .catch((err) => console.error("Error invoking GetMessageAsync:", err));
      chathubConnection.on("ReceiveMessages", (listMessages) => {
        setMessages(listMessages);
      });
    }
  }, [isShowChat, conversation]);

  useEffect(() => {
    if (
      chathubConnection.state === signalR.HubConnectionState.Connected &&
      isPreparing
    ) {
      chathubConnection
        .invoke(
          "SendMessagePreparingAsync",
          admin?.userId,
          isPreparing,
          conversation
        )
        .catch((err) =>
          console.error("Error invoking SendMessagePreparingAsync: ", err)
        );
    } else if (
      chathubConnection.state === signalR.HubConnectionState.Connected &&
      !isPreparing
    ) {
      chathubConnection
        .invoke(
          "SendMessagePreparingAsync",
          admin?.userId,
          isPreparing,
          conversation
        )
        .catch((err) =>
          console.error("Error invoking SendMessagePreparingAsync: ", err)
        );
    }
  }, [isPreparing]);

  useEffect(() => {
    if (!message.content) {
      setIsPreparing(false);
    } else {
      setIsPreparing(true);
    }
  }, [message]);

  return (
    <section className={cx("chat-container")}>
      <div className="container py-5">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-10">
            <div className={cx("card-custom", "card")} id="chat2">
              <ChatHeader
                setIsShowChat={setIsShowChat}
                isShowChat={isShowChat}
                admin={admin}
                adminStatus={adminStatus}
              />
              <ChatBody
                isPreparing={isPreparing}
                isAdminPreparing={isAdminPreparing}
                messages={messages}
                userLogin={userLogin}
              />
              {isShowEmoji ? (
                <ClickAwayListener
                  onClickAway={() => {
                    setIsShowEmoji(false);
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: "30px",
                    }}
                  >
                    <EmojiPicker
                      width="100%"
                      open={isShowEmoji}
                      onEmojiClick={handleChooseEmoji}
                      style={{ zIndex: 9999 }}
                    />
                  </Box>
                </ClickAwayListener>
              ) : null}
              <ChatBox
                setIsShowEmoji={setIsShowEmoji}
                isShowEmoji={isShowEmoji}
                handleSendMessage={handleSendMessage}
                setMessage={setMessage}
                message={message}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chat;
