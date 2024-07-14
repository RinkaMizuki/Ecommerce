/* eslint-disable react/prop-types */
import classNames from "classnames/bind";
import styles from "./Chat.module.scss";
import { memo, useEffect, useRef } from "react";
import { Avatar, Box } from "@mui/material";
import TooltipTime from "./TooltipTime";

const cx = classNames.bind(styles);

const ChatBody = ({ messages, userLogin, isAdminPreparing }) => {
    const lastMessageRef = useRef(null);
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, lastMessageRef.current]);
    const userPrepare = messages.find((msg) => msg.senderId != userLogin.id);

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
                            <TooltipTime date={msg?.sendAt}>
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
                            </TooltipTime>
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
                            <TooltipTime
                                date={msg?.sendAt}
                                position="right-start"
                            >
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
                            </TooltipTime>
                        </div>
                    );
                })}
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
