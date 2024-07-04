import classNames from "classnames/bind";
import styles from "./ModalStrange.module.scss";
import { deleteTokenFromCookie } from "../../services/signalrService";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../../redux/authSlice";
import { useEffect } from "react";
import Button from "../../components/Button";
import SystemSecurityUpdateWarningIcon from "@mui/icons-material/SystemSecurityUpdateWarning";

const cx = classNames.bind(styles);

const ModalStrange = ({ onHideModal, data }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            deleteTokenFromCookie("accessToken");
            dispatch(logoutSuccess());
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
    return (
        <div className={cx("modal-mask")}>
            <div className={cx("modal-confirm-container")}>
                <div className={cx("confirm-message")}>
                    <h1>Warning !</h1>
                    <SystemSecurityUpdateWarningIcon
                        sx={{
                            width: "50px",
                            height: "50px",
                            color: "#ffcc00",
                        }}
                    />
                    <p>
                        An unknown device has been detected logging into your
                        account.
                    </p>
                </div>
                <div className={cx("confirm-action")}>
                    <Button
                        type="button"
                        onClick={() => {
                            deleteTokenFromCookie("accessToken");
                            dispatch(logoutSuccess());
                            onHideModal(true);
                        }}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ModalStrange;
