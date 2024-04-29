import styles from "./Register.module.scss";
import classNames from "classnames/bind";
import ecommerceRegister from "../../assets/images/ecommerce-register.jpg";
import Button from "../../components/Button"
import Loading from "../../components/Loading"
import { Link, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCustomFetch from "../../hooks/useCustomFetch";
import useDebounce from "../../hooks/useDebounce";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { post } from "../../services/ssoService";

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

const Register = () => {

  //hooks
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isHidePassword, setIsHidePassword] = useState(true);
  const [isHideConfirmPassword, setIsHideConfirmPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isExistUserName, setIsExistUserName] = useState(false);
  const [loadingUserName, setLoadingUserName] = useState(false);
  const [getUserInfo] = useCustomFetch();
  const submitRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const userLogin = useSelector(state => state.auth.login.currentUser);

  const clearInput = () => {
    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }
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
  const handleToggleConfirmPassword = () => {
    const typeConfirmPassword = confirmPasswordRef.current?.getAttribute("type")
    if (typeConfirmPassword == "password") {
      confirmPasswordRef.current.setAttribute("type", "text")
      setIsHideConfirmPassword(false)
    }
    else {
      confirmPasswordRef.current.setAttribute("type", "password")
      setIsHideConfirmPassword(true)
    }
  }
  const debounced = useDebounce(userName, 500);
  useEffect(() => {
    if (!debounced?.trim()) {
      setIsExistUserName(true);
      return;
    }
    const fetchData = async () => {
      try {
        const response = await getUserInfo(`/Admin/users/${debounced}`);
        setIsExistUserName(response.data.isExisted);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingUserName(false);
      }
    }
    fetchData();
  }, [debounced])

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

  const handleCreateAccount = async () => {
    try {
      if (password != confirmPassword) {
        toast.error('Confirm password incorrect.', toastOptions);
        return;
      }
      const data = {
        email,
        username: userName,
        password,
        service: import.meta.env.VITE_ECOMMERCE_SERVICE_NAME,
        confirmPassword,
      }
      setIsLoading(true);
      // const res = await registerService("/Auth/register", data);
      const res = await post("/auth/register", data);
      if (res?.data?.statusCode == 201) {
        toast.success(res.data.message, toastOptions)
      }
      setTimeout(() => {
        clearInput();
      }, 500);
    }
    catch (err) {

      if (err?.response?.data?.statusCode == 409) { //status code conflict state 
        toast.error(err?.response?.data?.message, toastOptions)
      }
      else {
        toast.error(err?.response?.data?.message, toastOptions)
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (userLogin) {
    return <Navigate to="/" />
  }

  return (
    <div className={cx("register-wrapper")}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MT Store - Register</title>
        <link rel="canonical" href={`${window.location.origin}/register`} />
      </Helmet>
      <div className={cx("register-image")}>
        <ToastContainer></ToastContainer>
        <img src={ecommerceRegister} alt="Ecommerce" />
      </div>
      <div className={cx("register-form")}>
        <div className={cx("register-title")}>
          <h1>Create an account</h1>
          <p>Enter your details below</p>
        </div>
        <form className={cx("register-info")}>
          <div className={cx("username-input")}>
            <input type="text" placeholder="User Name" value={userName} onChange={(e) => {
              setUserName(e.target.value)
              setLoadingUserName(!!e.target.value);
              if (debounced === e.target.value) {
                setLoadingUserName(false);
              }
            }} required />
            {loadingUserName ? <i className={cx("fa-solid fa-spinner", "loading")}></i> : userName ? !loadingUserName ? (!isExistUserName ? <i className={cx("fa-regular fa-circle-check", "checked")}></i> : <i className={cx("fa-solid fa-ban", "cancel")}></i>) : <></> : <></>}
          </div>
          <input
            type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className={cx("password-wrapper")}>
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value.trim())} ref={passwordRef} />
            {!isHidePassword ? <i className="fa-regular fa-eye" onClick={handleTogglePassword}></i> : <i className="fa-regular fa-eye-slash" onClick={handleTogglePassword}></i>}
          </div>
          <div className={cx("password-wrapper")}>
            <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value.trim())} ref={confirmPasswordRef} />
            {!isHideConfirmPassword ? <i className="fa-regular fa-eye" onClick={handleToggleConfirmPassword}></i> : <i className="fa-regular fa-eye-slash" onClick={handleToggleConfirmPassword}></i>}
          </div>
        </form>
        <div>
          <Button className={cx("btn-register")} lagre onClick={handleCreateAccount} ref={submitRef}
            disable={!password || !userName || !email || !confirmPassword || isExistUserName}
          >
            {!isLoading ? "Create Account" : <Loading className={cx("custom-loading")} />}
          </Button>
        </div>
        <div className={cx("register-redirect")}>
          <span>Already have account?</span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
};

export default Register;
