import queryString from "query-string";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import Loading from "../Loading";
import { useDispatch, useSelector } from "react-redux";
//import { getToken as getTokenInfo } from "../../services/googleService";
import { post } from "../../services/ssoService";
import { toast } from "react-toastify";

const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
};

const GoogleLogin = () => {
    const userLogin = useSelector(
        (state) => state.auth.login?.currentUser?.user
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const type = JSON.parse(localStorage.getItem("authType"));

    useLayoutEffect(() => {
        const { error } = queryString.parse(window.location.href.split("?")[1]);
        if (error === "access_denied") {
            // Xử lý lỗi khi người dùng từ chối quyền truy cập
            window.location.href = `${window.location.origin}/login`;
        } else {
            // Xử lý đăng nhập thành công hoặc các lỗi khác
            const { code } = queryString.parse(
                window.location.href.split("?")[1]
            );
            const fetchData = async () => {
                try {
                    const data = {
                        code,
                        serviceName: import.meta.env
                            .VITE_ECOMMERCE_SERVICE_NAME,
                    };
                    if (type === "login") {
                        const userAuth = await post(
                            "/auth/google-login",
                            data,
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                        dispatch(
                            loginSuccess({
                                ...userAuth?.data,
                                type: "google",
                            })
                        );
                        navigate("/", {
                            replace: true,
                        });
                    } else {
                        const userLinked = await post(
                            "/auth/google-link",
                            data,
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                params: {
                                    userId: userLogin?.id,
                                },
                            }
                        );
                        dispatch(
                            loginSuccess({
                                ...userLinked?.data,
                                type: "google",
                            })
                        );
                        navigate("/manager/links", {
                            replace: true,
                        });
                    }
                } catch (error) {
                    console.log(error);
                    navigate(
                        `${type === "login" ? "/login" : "/manager/links"}`,
                        {
                            replace: true,
                            state: error?.response?.data,
                        }
                    );
                }
            };
            fetchData();
            //link account
        }
    }, []);

    return (
        <>
            <Loading />
        </>
    );
};

export default GoogleLogin;
