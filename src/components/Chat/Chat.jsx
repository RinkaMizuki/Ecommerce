/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import classNames from "classnames/bind";
import styles from "./Chat.module.scss";
import { useEffect, useLayoutEffect, useState } from "react";
import { chathubConnection } from "../../services/signalrService";
import * as signalR from "@microsoft/signalr";
import ChatBody from "./ChatBody";
import ChatBox from "./ChatBox";
import EmojiPicker from "emoji-picker-react";
import ChatHeader from "./ChatHeader";

const cx = classNames.bind(styles);

const Chat = ({ setIsShowChat, isShowChat, userLogin }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [admin, setAdmin] = useState(null);
    const [conversation, setConversation] = useState("");
    const [isShowEmoji, setIsShowEmoji] = useState(false);
    const [adminStatus, setAdminStatus] = useState(null);

    const handleSendMessage = async (e) => {
        if (e.type === "click" || (e.type === "keydown" && e.keyCode === 13))
            try {
                await chathubConnection.invoke(
                    "SendMessageAsync",
                    userLogin?.id,
                    admin?.email,
                    message,
                    conversation,
                    ""
                );
                setMessage("");
                setIsShowEmoji(false);
            } catch (error) {
                console.log(error);
            }
    };
    const handleChooseEmoji = (emojiObj, e) => {
        setMessage((prevText) => `${prevText}${emojiObj.emoji}`);
    };
    useLayoutEffect(() => {
        try {
            chathubConnection.on("ReceiveMessage", (newMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });

            chathubConnection.on(
                "ReceiveAdmin",
                (currentAdmin, conversationId) => {
                    setConversation(conversationId);
                    setAdmin(currentAdmin);
                }
            );

            chathubConnection.on("ReceiveStatus", (adminId, status) => {
                setAdminStatus({
                    adminId,
                    status,
                });
            });

            if (
                chathubConnection.state ===
                signalR.HubConnectionState.Disconnected
            ) {
                chathubConnection
                    .start()
                    .then(() => {
                        console.log("ChatHub connected successfully.");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        } catch (error) {
            console.log(error);
        }
        return () => {
            try {
                if (
                    chathubConnection.state ===
                    signalR.HubConnectionState.Connected
                ) {
                    chathubConnection
                        .stop()
                        .then(() =>
                            console.warn("ChatHub disconnected successfully.")
                        );
                }
            } catch (error) {
                console.log(error);
            }
        };
    }, []);

    useEffect(() => {
        if (
            (isShowChat || conversation) &&
            chathubConnection.state === signalR.HubConnectionState.Connected
        ) {
            try {
                chathubConnection.invoke("GetMessageAsync", conversation);
                chathubConnection.on("ReceiveMessages", (listMessages) => {
                    setMessages(listMessages);
                });
            } catch (err) {
                console.log(err);
            }
        }
    }, [isShowChat, conversation]);

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
                                messages={messages}
                                userLogin={userLogin}
                            />
                            <EmojiPicker
                                onEmojiClick={handleChooseEmoji}
                                height={480}
                                width={"100%"}
                                open={isShowEmoji}
                            />
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
