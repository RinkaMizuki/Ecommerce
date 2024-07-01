import { useLayoutEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Loading from "../Loading";
import { loginFailed, loginSuccess } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
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
const FacebookLogin = () => {
    const userLogin = useSelector(
        (state) => state.auth.login.currentUser?.user
    );
    //const [, postUserLinked] = useCustomFetch();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    useLayoutEffect(() => {
        const fetchData = async () => {
            const type = JSON.parse(localStorage.getItem("authType"));
            try {
                const userAuth = await post("/auth/facebook-login", null, {
                    params: {
                        facebookAccessToken: location.state.accessToken,
                        type,
                        userId: userLogin?.id,
                        serviceName: import.meta.env
                            .VITE_ECOMMERCE_SERVICE_NAME,
                    },
                });

                dispatch(
                    loginSuccess({
                        ...userAuth?.data,
                        type: "facebook",
                    })
                );
                navigate(`${type === "login" ? "/" : "/manager/links"}`, {
                    replace: true,
                });
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data?.message);
                dispatch(loginFailed(error.response?.data));
                navigate(`${type === "login" ? "/login" : "/manager/links"}`, {
                    replace: true,
                });
            }
        };
        fetchData();
    }, []);

    if (!location.state) {
        return <Navigate to="/" replace={true} />;
    } else if (location.state.status === "unknown") {
        return <Navigate to="/login" replace={true} />;
    }

    return (
        <>
            <Loading />
        </>
    );
};

export default FacebookLogin;
