import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import ecommerceRegister from "../../assets/images/ecommerce-register.jpg";
import Button from "../../components/Button"
import google from "../../assets/images/google.png"
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';
import FacebookIcon from '@mui/icons-material/Facebook';
import { loginFailed, loginStart, loginSuccess } from "../../redux/authSlice";
//import tokenService from "../../services/tokenService"
import Loading from "../../components/Loading";
import queryString from "query-string";
import { Helmet } from "react-helmet";
import FacebookLogin from 'react-facebook-login';
import { useLayoutEffect } from "react";
import { postAuth } from "../../services/ssoService";
import Popup from "../../components/Popup";
import { helpers } from "../../helpers/validate";

const toastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
}
const cx = classNames.bind(styles);

const Login = () => {

  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailForgot, setEmailForgot] = useState("");
  const [isHidePassword, setIsHidePassword] = useState(true);
  const [isSend, setIsSend] = useState(false);
  const passwordRef = useRef(null);
  const submitRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isFetching = useSelector(state => state.auth.login.isFetching);
  const userLogin = useSelector(state => state.auth.login.currentUser);
  //logics handle
  const handleTogglePassword = () => {
    const typePassword = passwordRef.current?.getAttribute("type")

    if (typePassword == "password") {
      passwordRef.current.setAttribute("type", "text")
      setIsHidePassword(false)
    } else {
      passwordRef.current.setAttribute("type", "password")
      setIsHidePassword(true)
    }
  }

  const handleGoogleAuth = () => {

    const queryStringData = queryString.stringify({
      client_id: import.meta.env.VITE_ECOMMERCE_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_ECOMMERCE_GOOGLE_REDIRECT_URI,
      scope: "openid profile email",
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      nonce: 'n-0S6_WzA2Mj',
      include_granted_scopes: true,
    });
    const googleAuthUrl = `${import.meta.env.VITE_ECOMMERCE_GOOGLE_BASE_URL}?${queryStringData}`;
    localStorage.setItem("authType", JSON.stringify("login"))
    window.location.href = googleAuthUrl;
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      submitRef.current?.click();
      return;
    }
  }

  const handleLogin = async () => {
    const user = {
      username: userNameOrEmail,
      password,
    }

    dispatch(loginStart())
    try {
      // const res = await loginService("/Auth/login", user);
      // tokenService.setToken({
      //   token: res.data.accessToken,
      // })
      // toast.success("Login account successfully !", toastOptions);
      const res = await postAuth("/auth/login", user);
      toast.success(res?.data?.message, toastOptions);
      setTimeout(() => {
        dispatch(loginSuccess({
          ...res?.data,
          type: "default"
        }))
        navigate("/")
      }, 1000);
    } catch (error) {
      if (error.response.status != 200) {
        toast.error("Login failed. Please try to again !", toastOptions);
        setPassword("")
      }
      dispatch(loginFailed({
        message: "Login failed"
      }))
    }
  }

  const responseFacebook = (res) => {
    localStorage.setItem("authType", JSON.stringify("login"))
    navigate("/signin-facebook", {
      state: res,
    })
  }

  useLayoutEffect(() => {
    if (location.state) {
      toast.error(location.state.message, toastOptions);
      window.history.replaceState({}, '')
    }
  }, [location.state])

  if (userLogin) {
    return <Navigate to="/" />
  }

  const resetInput = () => {
    setIsSend(false);
    setEmailForgot("");
  }

  const hanleForgotPassword = async () => {
    try {
      const res = await postAuth("/auth/forgot-password", {
        email: emailForgot,
        returnUrl: import.meta.env.VITE_ECOMMERCE_RESET_RETURN_URL
      })
      console.log(res);
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setIsSend(true)
    }
  }

  return (
    <div className={cx("login-wrapper")}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MT Store - Login</title>
        <link rel="canonical" href={`${window.location.origin}/login`} />
      </Helmet>
      <div className={cx("login-image")}>
        <ToastContainer style={{
          width: "30%",
          marginTop: "110px",
        }}></ToastContainer>
        <img src={ecommerceRegister} alt="Ecommerce" />
      </div>
      <div className={cx("login-form")}>
        <div className={cx("login-title")}>
          <h1>Log In to MT Store</h1>
          <p>Enter your details below</p>
        </div>
        <form className={cx("login-info")}>
          <input type="text" placeholder="User Name or Email" value={userNameOrEmail} required onChange={(e) => setUserNameOrEmail(e.target.value)} />
          <div className={cx("password-wrapper")}>
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} ref={passwordRef} value={password} />
            {!isHidePassword ? <i className="fa-regular fa-eye" onClick={handleTogglePassword}></i> : <i className="fa-regular fa-eye-slash" onClick={handleTogglePassword}></i>}
          </div>
        </form>
        <div className={cx("login-options")}>
          <Button className={cx("btn-login")} lagre onClick={handleLogin} ref={submitRef}
            disable={!userNameOrEmail || !password}
          >
            {!isFetching ? "Log In" : <Loading className={cx("custom-loading")} />}
          </Button>
          <Button className={cx("btn-google")} onClick={handleGoogleAuth}>
            <div>
              <img src={google} alt="google" />
              <span>Sign in with Google</span>
            </div>
          </Button>
          <FacebookLogin
            appId="1844560925992088"
            fields="id,name,email,picture"
            callback={responseFacebook}
            cssClass={cx("btn-facebook")}
            textButton="Sign in with Facebook"
            version="19.0"
            icon={<FacebookIcon style={{
              color: "rgb(24, 119, 242)",
              width: "40px",
              height: "40px"
            }} />}
          />
        </div>
        <div className={cx("forgot-password")}>
          <Popup
            onReset={resetInput}
            trigger={<span>Forgot password</span>
            }
            contentStyle={{
              width: "30%",
              padding: "2px",
              borderRadius: "5px",
              border: "0",
              animation: ".3s cubic-bezier(.38,.1,.36,.9) forwards a"
            }}
            header={
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
              }}>
                {!isSend ? <NoEncryptionIcon sx={{
                  width: "50px",
                  height: "50px",
                  color: "var(--primary)"
                }} /> : <MarkEmailUnreadIcon sx={{
                  width: "50px",
                  height: "50px",
                  color: "var(--primary)"
                }} />}
                <h1 style={{
                  fontWeight: "600",
                  fontSize: "27px"
                }}>{!isSend ? "Forgot Your Password" : "Check Your Email"}</h1>
                <span style={{
                  maxWidth: "80%",
                  textAlign: "center",
                  fontWeight: "500",
                  fontSize: isSend ? "15px" : "14px"
                }}>{!isSend ? "Enter your email address and we will send you instructions to reset your password." : <div style={{
                  marginTop: "10px",
                  lineHeight: "1.2"
                }}>Please check the email address <span style={{
                  textDecoration: "underline",
                  color: "var(--primary)",
                  fontWeight: "400"
                }}>{emailForgot}</span> for instructions to reset your password.</div>}</span>
              </div>
            }
            content={<div className={cx("login-info")} style={{
              flex: 1
            }}>
              {!isSend ? <input type="text" placeholder="Enter Your Email" required className={cx("input-forgot")} value={emailForgot} onChange={(e) => setEmailForgot(e.target.value)} /> : <></>}
            </div>}
            action={
              <Button className={cx("btn-agree")} onClick={hanleForgotPassword} disable={!emailForgot || !helpers.validateEmail(emailForgot)} >
                <div className={cx("btn-content")}>
                  <span className={cx("btn-text-agree")}>{!isSend ? "Send Email" : "Resend Email"}</span>
                </div>
              </Button>
            }
          />
        </div>
      </div>
    </div>
  )
};

export default Login;
