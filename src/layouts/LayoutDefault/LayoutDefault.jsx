import styles from "./LayoutDefault.module.scss";
import classNames from "classnames/bind";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";
import Map from "../../components/Map";
import Chat from "../../components/Chat/Chat";
import { useState } from "react";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles);

// eslint-disable-next-line react/prop-types
const LayoutDefault = ({ toggleTopHeader, children }) => {
    const location = useLocation();
    const [isShowChat, setIsShowChat] = useState(false);
    const userLogin = useSelector(
        (state) => state.auth.login?.currentUser?.user
    );
    return (
        <>
            <Header toggleTopHeader={toggleTopHeader} />
            <div
                className={cx("content-wrapper")}
                style={{
                    minHeight: `${
                        location.pathname.includes("/product-detail") ||
                        location.pathname.includes("/favorite")
                            ? "190vh"
                            : "100vh"
                    }`,
                    marginTop: !toggleTopHeader ? "unset" : "76px",
                }}
            >
                {userLogin &&
                    (isShowChat ? (
                        <Chat
                            setIsShowChat={setIsShowChat}
                            userLogin={userLogin}
                            isShowChat={isShowChat}
                        />
                    ) : (
                        <div
                            className={cx("chat-icon")}
                            onClick={() => setIsShowChat(!isShowChat)}
                        >
                            <i className="fa-solid fa-comment-dots"></i>
                        </div>
                    ))}
                {children}
            </div>
            {window.location.pathname === "/" && (
                <Map address={import.meta.env.VITE_ECOMMERCE_DEFAULT_ADDRESS} />
            )}
            <Footer />
        </>
    );
};

export default LayoutDefault;
