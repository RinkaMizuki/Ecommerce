/* eslint-disable react/prop-types */
import classNames from "classnames/bind";
import styles from "./Chat.module.scss";

const cx = classNames.bind(styles);

const ChatBox = ({
    handleSendMessage,
    message,
    setMessage,
    setIsShowEmoji,
    isShowEmoji,
}) => {
    return (
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
            <span
                className="ms-3 text-muted"
                onClick={() => setIsShowEmoji(!isShowEmoji)}
            >
                <i className="fas fa-smile"></i>
            </span>
            <span
                onClick={handleSendMessage}
                className="ms-3"
                style={{
                    cursor: `${message ? "pointer" : "default"}`,
                    color: `${message && "#0866ff"}`,
                }}
            >
                <i className="fas fa-paper-plane"></i>
            </span>
        </div>
    );
};

export default ChatBox;
