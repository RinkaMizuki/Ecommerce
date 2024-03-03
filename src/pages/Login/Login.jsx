import styles from "./Login.module.scss";
import classNames from "classnames/bind";
import ecommerceRegister from "../../assets/images/ecommerce-register.jpg";
import Button from "../../components/Button"
import google from "../../assets/images/google.png"
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import useCustomFetch from "../../hooks/useCustomFetch";
import { loginFailed, loginStart, loginSuccess } from "../../redux/authSlice";
import tokenService from "../../services/tokenService"
import Loading from "../../components/Loading";

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
  const [isHidePassword, setIsHidePassword] = useState(true);
  const [get, loginService] = useCustomFetch();
  const passwordRef = useRef(null);
  const submitRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isFetching = useSelector(state => state.auth.login.isFetching);
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
      userNameOrEmail,
      password
    }

    dispatch(loginStart())
    try {
      const res = await loginService("/Auth/login", user);
      tokenService.setToken({
        token: res.data.accessToken,
      })

      toast.success("Login account successfully !", toastOptions);

      setTimeout(() => {
        dispatch(loginSuccess(res?.data))
        navigate("/")
      }, 1000);

    } catch (error) {

      if (error.response.status != 200) {
        toast.error("Login failed. Please try to again !", toastOptions);
      }
      dispatch(loginFailed({
        message: "login failed"
      }))
    }
  }

  return (
    <div className={cx("login-wrapper")}>
      <ToastContainer></ToastContainer>
      <div className={cx("login-image")}>
        <img src={ecommerceRegister} alt="Ecommerce" />
      </div>
      <div className={cx("login-form")}>
        <div className={cx("login-title")}>
          <h1>Log In to Exclusive</h1>
          <p>Enter your details below</p>
        </div>
        <form className={cx("login-info")}>
          <input type="text" placeholder="User Name or Email" value={userNameOrEmail} required onChange={(e) => setUserNameOrEmail(e.target.value)} />
          <div className={cx("password-wrapper")}>
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} ref={passwordRef} value={password} />
            {!isHidePassword ? <i className="fa-regular fa-eye" onClick={handleTogglePassword}></i> : <i className="fa-regular fa-eye-slash" onClick={handleTogglePassword}></i>}
          </div>
        </form>
        <div>
          <Button className={cx("btn-login")} lagre onClick={handleLogin} ref={submitRef}
            disable={!userNameOrEmail || !password}
          >
            {!isFetching ? "Log In" : <Loading className={cx("custom-loading")} />}
          </Button>
          <Button className={cx("btn-google")}>
            <div>
              <img src={google} alt="google" />
              <span>Sign in with Google</span>
            </div>
          </Button>
        </div>
        <div className={cx("login-redirect")}>
          <Link to="/">Forgot password</Link>
        </div>
      </div>
    </div>
  )
};

export default Login;
