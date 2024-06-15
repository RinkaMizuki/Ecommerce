/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import classNames from "classnames/bind";
import styles from "./Chat.module.scss";
import { useEffect, useState } from "react";
import { chathubConnection } from "../../services/signalrService";
import * as signalR from "@microsoft/signalr";
import { Avatar } from "@mui/material";

const cx = classNames.bind(styles);

const Chat = ({ setIsShowChat }) => {
    const [message, setMessage] = useState("");
    const [admin, setAdmin] = useState(null);

    const handleSendMessage = async (e) => {
        if (e.type === "click" || (e.type === "keydown" && e.keyCode === 13))
            try {
                await chathubConnection.invoke(
                    "SendMessageAsync",
                    admin?.userId,
                    message
                );
                setMessage("");
            } catch (error) {
                console.log(error);
            }
    };

    useEffect(() => {
        chathubConnection.on("ReceiveAdmin", (currentAdmin) => {
            console.log(currentAdmin);
            setAdmin(currentAdmin);
        });

        if (
            chathubConnection.state === signalR.HubConnectionState.Disconnected
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

        return () => {
            if (
                chathubConnection.state === signalR.HubConnectionState.Connected
            ) {
                chathubConnection
                    .stop()
                    .then(() =>
                        console.warn("ChatHub disconnected successfully.")
                    );
            }
        };
    }, []);

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
                                    onClick={() => setIsShowChat(false)}
                                    type="button"
                                    data-mdb-button-init
                                    data-mdb-ripple-init
                                    className="btn btn-danger btn-sm"
                                    data-mdb-ripple-color="dark"
                                >
                                    Close
                                </button>
                            </div>
                            <div
                                className={cx("card-body")}
                                style={{
                                    position: "relative",
                                    height: "400px",
                                }}
                            >
                                <div className="d-flex flex-row justify-content-start">
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                                        alt="avatar 1"
                                        style={{
                                            width: "45px",
                                            height: "100%",
                                        }}
                                    />
                                    <div>
                                        <p
                                            className="small p-2 ms-3 mb-1 rounded-3"
                                            style={{
                                                backgroundColor: "#f5f6f7",
                                            }}
                                        >
                                            Hi
                                        </p>
                                        <p
                                            className="small p-2 ms-3 mb-1 rounded-3"
                                            style={{
                                                backgroundColor: "#f5f6f7",
                                            }}
                                        >
                                            How are you ...???
                                        </p>
                                        <p
                                            className="small p-2 ms-3 mb-1 rounded-3"
                                            style={{
                                                backgroundColor: "#f5f6f7",
                                            }}
                                        >
                                            What are you doing tomorrow? Can we
                                            come up a bar?
                                        </p>
                                        <p className="small ms-3 mb-3 rounded-3 text-muted">
                                            23:58
                                        </p>
                                    </div>
                                </div>

                                <div className="divider d-flex align-items-center mb-4">
                                    <p
                                        className="text-center mx-3 mb-0"
                                        style={{
                                            color: "#a2aab7",
                                        }}
                                    >
                                        Today
                                    </p>
                                </div>

                                <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                                    <div>
                                        <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                                            Hiii, I'm good.
                                        </p>
                                        <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                                            How are you doing?
                                        </p>
                                        <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                                            Long time no see! Tomorrow office.
                                            will be free on sunday.
                                        </p>
                                        <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">
                                            00:06
                                        </p>
                                    </div>
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                                        alt="avatar 1"
                                        style={{
                                            width: "45px",
                                            height: "100%",
                                        }}
                                    />
                                </div>
                                <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                                    <div>
                                        <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                                            Hiii, I'm good.
                                        </p>
                                        <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                                            How are you doing?
                                        </p>
                                        <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                                            Long time no see! Tomorrow office.
                                            will be free on sunday.
                                        </p>
                                        <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">
                                            00:06
                                        </p>
                                    </div>
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                                        alt="avatar 1"
                                        style={{
                                            width: "45px",
                                            height: "100%",
                                        }}
                                    />
                                </div>
                            </div>
                            <div
                                className={cx(
                                    "chat-area",
                                    "card-footer text-muted d-flex justify-content-start align-items-center p-2"
                                )}
                            >
                                <input
                                    onKeyDown={handleSendMessage}
                                    type="text"
                                    className="form-control form-control-lg"
                                    id="exampleFormControlInput1"
                                    placeholder="Type message"
                                    onChange={(e) => setMessage(e.target.value)}
                                    value={message}
                                />
                                <span className="ms-3 text-muted">
                                    <i className="fas fa-smile"></i>
                                </span>
                                <span
                                    onClick={handleSendMessage}
                                    className="ms-3"
                                    style={{
                                        cursor: `${
                                            message ? "pointer" : "default"
                                        }`,
                                        color: `${message && "#0866ff"}`,
                                    }}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Chat;
