import classNames from "classnames/bind";
import styles from "./Chat.module.scss";
import { memo, useEffect, useRef } from "react";
import { Avatar } from "@mui/material";

import ChatMessage from "./ChatMessage";

const cx = classNames.bind(styles);

export const MESSAGE_TYPE = {
  TEXT: "text",
  IMAGE: "image",
  AUDIO: "audio",
  ICON: "icon",
  VIDEO: "video",
};

const ChatBody = ({ messages, userLogin, isAdminPreparing }) => {
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, lastMessageRef.current]);
  const userPrepare = messages.find((msg) => msg.senderId != userLogin.id);

  return (
    <div className={cx("card-body")}>
      {messages
        .sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt))
        .map((msg, index) => (
          <ChatMessage
            key={msg.messageId}
            index={index}
            totalMessage={messages.length}
            ref={lastMessageRef}
            msg={msg}
            userLogin={userLogin}
          />
        ))}
      {isAdminPreparing && (
        <div
          className="d-flex flex-row align-items-center justify-content-start pt-1 gap-3"
          ref={lastMessageRef}
        >
          <Avatar
            src={userPrepare?.sender?.url}
            alt={userPrepare?.sender?.avatar}
          />
          <div className={cx("is-typing")}>
            <div className={cx("jump1")}></div>
            <div className={cx("jump2")}></div>
            <div className={cx("jump3")}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ChatBody);
