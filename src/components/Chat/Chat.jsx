/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import classNames from "classnames/bind";
import styles from "./Chat.module.scss";
import { useEffect, useLayoutEffect, useState } from "react";
import { chathubConnection } from "../../services/signalrService";
import * as signalR from "@microsoft/signalr";
import { Avatar } from "@mui/material";
import ChatBody from "./ChatBody";
import ChatBox from "./ChatBox";

const cx = classNames.bind(styles);

const Chat = ({ setIsShowChat, isShowChat, userLogin }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [admin, setAdmin] = useState(null);
    const [conversation, setConversation] = useState("");

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
            } catch (error) {
                console.log(error);
            }
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
                    <div className="col-lg-8 col-xl-9">
                        <div className={cx("card-custom", "card")} id="chat2">
                            <div className="card-header d-flex justify-content-between align-items-center p-3">
                                <div className="d-flex align-items-center gap-3">
                                    <Avatar src={admin?.url} />
                                    <div>
                                        <h3
                                            className="mb-0"
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "20px",
                                            }}
                                        >
                                            {admin?.userName || "Unknown"}
                                        </h3>
                                        <span
                                            style={{
                                                fontSize: "14px",
                                                color: "var(--text-gray-700)",
                                            }}
                                        >
                                            {admin?.email}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsShowChat(!isShowChat)}
                                    type="button"
                                    data-mdb-button-init
                                    data-mdb-ripple-init
                                    className="btn btn-danger btn-sm"
                                    data-mdb-ripple-color="dark"
                                >
                                    Close
                                </button>
                            </div>
                            <ChatBody
                                messages={messages}
                                userLogin={userLogin}
                            />
                            <ChatBox
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
