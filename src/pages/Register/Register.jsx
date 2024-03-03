import styles from "./Register.module.scss";
import classNames from "classnames/bind";
import ecommerceRegister from "../../assets/images/ecommerce-register.jpg";
import Button from "../../components/Button"
import google from "../../assets/images/google.png"
import Loading from "../../components/Loading"
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCustomFetch from "../../hooks/useCustomFetch";

const toastOptions = {
  position: "top-right",
  autoClose: 3000,
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
  const [, registerService] = useCustomFetch();
  const passwordRef = useRef(null);
  const submitRef = useRef(null);
  const confirmPaaswordRef = useRef(null);

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
    const typeConfirmPassword = confirmPaaswordRef.current?.getAttribute("type")
    if (typeConfirmPassword == "password") {
      confirmPaaswordRef.current.setAttribute("type", "text")
      setIsHideConfirmPassword(false)
    }
    else {
      confirmPaaswordRef.current.setAttribute("type", "password")
      setIsHideConfirmPassword(true)
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

  const handleCreateAccount = async () => {
    if (password != confirmPassword) {
      toast.error('Confirm password incorrect !!!', toastOptions);
      return;
    }
    const data = {
      userName,
      email,
      password,
      confirmPassword,
    }
    setIsLoading(true);
    const res = await registerService("/Auth/register", data)
    setTimeout(() => {
      if (res.data.statusCode == 201) {
        toast.success(res.data.message, toastOptions)
      }
      else if (res.data.statusCode == 409) { //status code conflict state 
        toast.error("Account already exist !", toastOptions)
      }
      else {
        toast.error(res.data.message, toastOptions)
      }
      clearInput();
      setIsLoading(false);
    }, 500);
  }

  return (
    <div className={cx("register-wrapper")}>
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
          <input type="text" placeholder="User Name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
          <input
            type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className={cx("password-wrapper")}>
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} ref={passwordRef} />
            {!isHidePassword ? <i className="fa-regular fa-eye" onClick={handleTogglePassword}></i> : <i className="fa-regular fa-eye-slash" onClick={handleTogglePassword}></i>}
          </div>
          <div className={cx("password-wrapper")}>
            <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} ref={confirmPaaswordRef} />
            {!isHideConfirmPassword ? <i className="fa-regular fa-eye" onClick={handleToggleConfirmPassword}></i> : <i className="fa-regular fa-eye-slash" onClick={handleToggleConfirmPassword}></i>}
          </div>
        </form>
        <div>
          <Button className={cx("btn-register")} lagre onClick={handleCreateAccount} ref={submitRef}
            disable={!password || !userName || !email || !confirmPassword}
          >
            {!isLoading ? "Create Account" : <Loading className={cx("custom-loading")} />}
          </Button>
          <Button className={cx("btn-google")}>
            <div>
              <img src={google} alt="google" />

              <span>Sign up with Google</span>
            </div>
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
