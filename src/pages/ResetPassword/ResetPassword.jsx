import classNames from "classnames/bind";
import styles from "./ResetPassword.module.scss";
import LockResetIcon from '@mui/icons-material/LockReset';
import Button from "../../components/Button";
import { useRef, useState } from "react";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { post as postResetPassword } from "../../services/ssoService";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const cx = classNames.bind(styles);
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
const ResetPassword = () => {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isHidePassword, setIsHidePassword] = useState(true);
  const [isHideConfirmPassword, setIsHideConfirmPassword] = useState(true);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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

  const handleResetPassword = async () => {
    try {
      const token = searchParams.get("token") ?? "";
      if (!token) return;
      const res = await postResetPassword("/auth/reset-password", {
        token,
        password,
      })
      if (res.status === 200) {
        toast.success(res.data?.message, toastOptions)
      } else {
        toast.error(res.data?.message, toastOptions)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data?.message, toastOptions)
    } finally {
      navigate("/login")
    }
  }

  if (!searchParams.get("token")) {
    return Navigate({ to: "/login", replace: true })
  }
  else {
    try {
      const values = jwtDecode(searchParams.get("token"))
      const currentDate = new Date();
      if (values.exp * 1000 < currentDate.getTime()) {
        return Navigate({ to: "/login", replace: true })
      }
    } catch (err) {
      console.log(err);
      return Navigate({ to: "/login", replace: true })
    }
  }

  return (
    <div className={cx("reset-container")}>
      <div className={cx("reset-wrapper")}>
        <LockResetIcon sx={{
          alignSelf: "center",
          width: "70px",
          height: "70px",
          color: "var(--primary)"
        }} />
        <h1>Reset Your Password</h1>
        <span>Your new password must be different to previos password</span>
        <div className={cx("input-container")}>
          <div className={cx("input-wrapper")}>
            <input type="password" name="password" id="password" placeholder="Enter new password" ref={passwordRef} onChange={(e) => setPassword(e.target.value.trim())} value={password} />
            {!isHidePassword ? <i className="fa-regular fa-eye" onClick={handleTogglePassword}></i> : <i className="fa-regular fa-eye-slash" onClick={handleTogglePassword}></i>}
          </div>
          <div className={cx("input-wrapper")}>
            <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm new password" ref={confirmPasswordRef} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value.trim())} />
            {!isHideConfirmPassword ? <i className="fa-regular fa-eye" onClick={handleToggleConfirmPassword}></i> : <i className="fa-regular fa-eye-slash" onClick={handleToggleConfirmPassword}></i>}
          </div>
        </div>
        <Button className={cx("btn-reset")} onClick={handleResetPassword} disable={!confirmPassword || !password || confirmPassword != password}>Reset Password</Button>
      </div>
    </div>
  )
};

export default ResetPassword;
