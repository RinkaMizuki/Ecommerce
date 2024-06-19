/* eslint-disable react/prop-types */
import classNames from "classnames/bind";
import styles from "./Chat.module.scss";
import { memo, useEffect, useRef } from "react";
import { Avatar } from "@mui/material";

const cx = classNames.bind(styles);

const ChatBody = ({ messages, userLogin }) => {
    const lastMessageRef = useRef(null);
    useEffect(() => {
        // Cuộn tới tin nhắn cuối cùng khi danh sách tin nhắn thay đổi
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div
            className={cx("card-body")}
            style={{
                position: "relative",
                height: "400px",
            }}
        >
            {messages
                .sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt))
                .map((msg, index) => {
                    return userLogin?.id === msg.senderId ? (
                        <div
                            className="d-flex flex-row justify-content-end mb-3 mt-3 pt-1"
                            key={msg.messageId}
                            ref={
                                index === messages.length - 1
                                    ? lastMessageRef
                                    : null
                            }
                        >
                            <div
                                style={{
                                    maxWidth: "240px",
                                }}
                            >
                                <p
                                    className="small me-2 text-white rounded-3 bg-primary p-2"
                                    style={{
                                        lineHeight: "1.4",
                                    }}
                                >
                                    {msg.messageContent}
                                </p>
                            </div>
                            <Avatar
                                src={msg.sender?.url}
                                alt={msg.sender?.avatar}
                            />
                        </div>
                    ) : (
                        <div
                            className="d-flex flex-row justify-content-start pt-1"
                            key={msg.messageId}
                            ref={
                                index === messages.length - 1
                                    ? lastMessageRef
                                    : null
                            }
                        >
                            <Avatar
                                src={msg.sender?.url}
                                alt={msg.sender?.avatar}
                            />
                            <div>
                                <p
                                    className="small p-2 ms-3 rounded-3"
                                    style={{
                                        backgroundColor: "#f5f6f7",
                                        height: "100%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    {msg.messageContent}
                                </p>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default memo(ChatBody);
