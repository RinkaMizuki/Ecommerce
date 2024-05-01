import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import Button from "../../components/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import defaultAvatar from "../../assets/images/avatar.jpeg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import useCustomFetch from "../../hooks/useCustomFetch";
import useDebounce from "../../hooks/useDebounce";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { toast, ToastContainer } from "react-toastify";
import { loginSuccess } from "../../redux/authSlice";
import PhoneLockedIcon from '@mui/icons-material/PhoneLocked';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import moment from "moment";
import Loading from "../../components/Loading";
import { helpers } from "../../helpers/validate";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import Popup from "../../components/Popup";
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import { get as getOtpCode, post as postVerifyOtp } from "../../services/ssoService";
import Countdown from 'react-countdown';
import Count from "./Count";

const toastOptions = {
  position: "top-right",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
}

const cx = classNames.bind(styles);

const Profile = () => {
  const userLogin = useSelector(state => state.auth.login.currentUser.user);
  const loginType = useSelector(state => state.auth.login.type);
  const [userName, setUserName] = useState(userLogin?.userName);
  const [isExistUserName, setIsExistUserName] = useState(false);
  const [loading, setLoading] = useState(false);
  const [f2aLoading, setF2aLoading] = useState(false);
  const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false);
  const [email, setEmail] = useState(userLogin?.email);
  const [phone, setPhone] = useState(userLogin?.phone);
  const [birth, setBirth] = useState(moment(userLogin?.birthDate).format('YYYY-MM-DD'));
  const [isDisable, setIsDisable] = useState(true);
  const [isF2A, setIsF2A] = useState(userLogin?.f2a);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSend, setIsSend] = useState(false);
  const [toggleResend, setToggleResend] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [file, setFile] = useState(null);
  const [blob, setBlob] = useState(null);
  const [open, setOpen] = useState(false);

  const inputFileRef = useRef(null);
  const avatarRef = useRef(null);
  const popupRef = useRef(null);

  const dispatch = useDispatch();

  const [getUserInfo, , updateUserProfile] = useCustomFetch();

  const handleUploadAvatar = () => {
    inputFileRef.current.click();
  }
  const handleSaveProfile = async () => {
    try {

      if (confirmPassword && newPassword && currentPassword) {
        if (!(confirmPassword.length >= 3) || !(newPassword.length >= 3) || !(currentPassword.length >= 3)) {
          toast.error("Requires must least 3 characters.", toastOptions);
          return;
        }
      }

      if (!currentPassword && !newPassword && confirmPassword) {
        toast.error("Please enter your password.", toastOptions);
        return;
      }
      else if (!newPassword && !confirmPassword && currentPassword) {
        toast.error("Please enter your new password.", toastOptions);
        return;
      }
      else if (!confirmPassword && !currentPassword && newPassword) {
        toast.error("Please enter your password.", toastOptions);
        return;
      }
      else if (currentPassword && newPassword) {
        if (!confirmPassword) {
          toast.error("Please enter your confirm password.", toastOptions);
          return;
        }
        else if (!(confirmPassword.length >= 3)) {
          toast.error("Requires must least 3 characters.", toastOptions);
          return;
        }
        else if (newPassword != confirmPassword) {
          toast.error("Confirm password incorrect.", toastOptions);
          return;
        }
      } else if (newPassword && confirmPassword) {
        if (!currentPassword) {
          toast.error("Please enter your password.", toastOptions);
          return;
        }
        else if (!(currentPassword.length >= 3)) {
          toast.error("Requires must least 3 characters.", toastOptions);
          return;
        }
      } else if (confirmPassword && currentPassword) {
        if (!newPassword) {
          toast.error("Please enter your new password.", toastOptions);
          return;
        }
        else if (!(newPassword.length >= 3)) {
          toast.error("Requires must least 3 characters.", toastOptions);
          return;
        }
      }

      const formData = new FormData();
      formData.append("password", currentPassword);
      formData.append("newPassword", newPassword);
      formData.append("phone", phone);
      formData.append("userName", userName);
      formData.append("email", email);
      formData.append("birthDate", birth);
      formData.append("avatar", file);
      setLoadingUpdateProfile(true);

      const response = await updateUserProfile(`/Admin/users/update/profile/${userLogin.id}`, formData);
      setLoadingUpdateProfile(false);
      dispatch(loginSuccess(response.data))

      toast.success("Profile updated successfully.", toastOptions)
      setConfirmPassword("");
      setNewPassword("");
      setCurrentPassword("");

    } catch (error) {
      toast.error(error?.response?.data?.message, toastOptions)
      console.log(error);
      setLoadingUpdateProfile(false);
    }
  }

  const handleResetChange = () => {
    setUserName(userLogin?.userName);
    setEmail(userLogin?.email);
    setPhone(userLogin?.phone);
    setBirth(moment(userLogin?.birthDate).format('YYYY-MM-DD'));
    setConfirmPassword("");
    setNewPassword("");
    setCurrentPassword("");
    setIsDisable(true);
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
    // const handleLoadProfile = function (event) {
    //   if (event.key === 'reloadEvent' && event.newValue === 'profile') {
    //     window.location.reload();
    //     // Đặt lại giá trị để tránh việc xử lý lặp lại
    //     localStorage.setItem('reloadEvent', '');
    //   }
    // }

    // window.addEventListener('storage', handleLoadProfile);
    // return () => {
    //   window.removeEventListener("storage", handleLoadProfile);
    // }
  }, [])

  const validateSaveChanges = () => {
    return isExistUserName || !email || ((new Date(birth).getTime() - 7 * 60 * 60 * 1000) > new Date().getTime()) || !helpers.validatePhoneNumber(phone) || !phone || !helpers.validateEmail(email) || isDisable;
  }

  const handleAvatarChange = (e) => {
    if (e.target.files[0].name != userLogin?.avatar) {
      const blob = URL.createObjectURL(e.target.files[0]);
      setBlob(blob);
      setFile(e.target.files[0]);
      setIsDisable(false);
    }
  }

  const handleVerifyEmail = async () => {
    try {
      if (!userLogin?.emailConfirm) {
        const resendConfirmEmail = getUserInfo;
        const response = await resendConfirmEmail(`/Auth/resend-confirm-email/${userLogin?.id}`);
        toast.success(response?.data?.message, toastOptions);
      }
      else {
        toast.info("Your email has been verified.", toastOptions);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message, toastOptions);
    }
  }

  const handleSwitchF2A = async () => {
    !isSend && setOpen(!open);
    setIsF2A(!isF2A)
    if (isSend) {
      popupRef.current?.hiddenPopup();
    }
  }

  const debounced = useDebounce(userName, 500);
  useEffect(() => {
    if (!debounced?.trim()) {
      setIsExistUserName(true);
      return;
    }
    if (debounced == userLogin?.userName) {
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      const response = await getUserInfo(`/Admin/users/${userName}`);
      setIsExistUserName(response.data.isExisted);
      setLoading(false);
    }
    fetchData();
  }, [debounced])

  useEffect(() => {
    function removeObjUrl() {
      URL.revokeObjectURL(blob);
    }
    avatarRef?.current?.addEventListener("load", removeObjUrl)

    return () => {
      avatarRef?.current?.removeEventListener("load", removeObjUrl)
    }

  }, [blob])

  const handleEnableF2A = async (isResend = false) => {
    setF2aLoading(true);
    if (!isSend || isResend) {
      try {
        const res = await getOtpCode("/auth/enable-f2a", {
          params: {
            phone: userLogin?.phone
          }
        });
        console.log(res);
        setIsSend(true);
        setToggleResend(!toggleResend)
      }
      catch (err) {
        console.log(err);
      } finally {
        setF2aLoading(false);
      }
    }
    else {
      try {
        const res = await postVerifyOtp("/auth/verify-otp", {
          userId: userLogin?.id,
          phone: userLogin?.phone,
          otp: otpCode,
          isF2A,
        });
        if (res.data?.statusCode === 200) {
          setIsSend(false);
        }
        dispatch(loginSuccess({
          ...res?.data,
          type: loginType
        }))
        toast.success(res.data?.message, toastOptions);
        setOtpCode("");
        closeModal();
      }
      catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message, toastOptions);
      } finally {
        setF2aLoading(false);
      }
    }
  }

  const handleResendOtp = useCallback(() => handleEnableF2A(true), [toggleResend])

  return (
    <div className={cx("profile-container")}>
      <ToastContainer
        style={{ marginTop: "120px" }}
      ></ToastContainer>
      <h2>Edit Your Profile</h2>
      <div className={cx("info-wrapper")}>
        <div style={{
          display: "flex",
          gap: "110px",
          marginTop: "20px"
        }}>
          <div className={cx("personal-image")}
            onClick={handleUploadAvatar}
          >
            <input type="file" hidden ref={inputFileRef} onChange={handleAvatarChange} accept=".png, .jpeg, .jpg" />
            <figure className={cx("personal-figure")}>
              {!blob ? <LazyLoadImage src={userLogin?.url || defaultAvatar} className={cx("personal-avatar")} alt={userLogin?.image || "avatar"}
                effect="blur"
              /> : <img src={blob} className={cx("personal-avatar")} alt="avatar" ref={avatarRef} />}
              <figcaption className={cx("personal-figcaption")}>
                <img src="https://raw.githubusercontent.com/ThiagoLuizNunes/angular-boilerplate/master/src/assets/imgs/camera-white.png" />
              </figcaption>
            </figure>
          </div>
          <div className={cx("info-personal")}>

            <div className={cx("info-personal-item")}>
              <label htmlFor="userName">User Name</label>
              <input type="text" name="userName" id="userName" placeholder="Name"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value)
                  setLoading(!!e.target.value);
                  if (debounced === e.target.value) {
                    setLoading(false);
                  }
                  isDisable && setIsDisable(false);
                }}
              />
              <span className={cx("username-note")}>User name when you change is unique.</span>
              {loading ? <i className={cx("fa-solid fa-spinner", "loading")}></i> : userName ? !loading ? (!isExistUserName ? <i className={cx("fa-regular fa-circle-check", "checked")}></i> : <i className={cx("fa-solid fa-ban", "cancel")}></i>) : <></> : <></>}
            </div>
            <div className={cx("info-personal-item")}>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" placeholder="Example@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  isDisable && setIsDisable(false);
                }}
              />
              <Tippy content={<span style={{
                fontFamily: "Poppins"
              }}>{!userLogin?.emailConfirm ? "Unverified" : "Verified"}</span>}>
                <span onClick={handleVerifyEmail} className={cx("verify-status")}>
                  {!userLogin?.emailConfirm ? <NotificationsOffIcon className={cx("notifi-icon")}
                    style={{
                      color: !userLogin?.emailConfirm && "#9d9d9d",
                    }}
                  /> : <NotificationsActiveIcon className={cx("notifi-icon")}
                    style={{
                      color: userLogin?.emailConfirm && "#ffb100"
                    }}
                  />}
                </span>
              </Tippy>
              <span className={cx("email-note")}>You will need to verify your new email address after you change it.</span>
            </div>
            <div className={cx("info-personal-item")}>
              <label htmlFor="phone">Phone</label>
              <input type="text" name="phone" id="phone"
                placeholder="Enter your phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  isDisable && setIsDisable(false);
                }}
              />
            </div>
            <div className={cx("info-personal-item")}>
              <label htmlFor="birthDate">Birth Date</label>
              <input type="date" name="birthDate" id="birthDate"
                value={birth}
                onChange={(e) => {
                  setBirth(e.target.value)
                  isDisable && setIsDisable(false);
                }}
              />
            </div>
          </div>
        </div>
        <div className={cx("password-wrapper")}>
          <div className={cx("info-password")}>
            <label htmlFor="currentPassword">Password Changes</label>
            <input type="password" name="currentPassword" id="currentPassword"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value.trim())
                isDisable && setIsDisable(false);
              }}
            />
            <input type="password" name="newPassword" placeholder="New password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value.trim())
                isDisable && setIsDisable(false);
              }}
            />
            <span className={cx("new-password-note")}>New password requires at least 3 characters.</span>
            <input type="password" name="confirmPassword" placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value.trim())
                isDisable && setIsDisable(false);
              }}
            />
            <span className={cx("confirm-password-note")}>Confirm password must match the new password.</span>
          </div>
          <div className={cx("featured-wrapper")}>
            <h1>Security Account</h1>
            <Tippy content={<span style={{
              fontFamily: "Poppins",
            }}>{!userLogin?.phone ? "Verify Your Phone" : "Verified"}</span>}>
              <FormGroup>
                <FormControlLabel disabled={!userLogin?.phone} control={<Switch checked={isF2A} onChange={handleSwitchF2A} />} label="Enabled F2A" />
              </FormGroup>
            </Tippy>
            <Popup
              ref={popupRef}
              isSend={isSend}
              onReset={handleSwitchF2A}
              open={open}
              contentStyle={{
                width: "25%",
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
                  {!isSend ? <PhoneLockedIcon sx={{
                    width: "50px",
                    height: "50px",
                    color: "var(--primary)"
                  }} /> : <UnpublishedIcon sx={{
                    width: "50px",
                    height: "50px",
                    color: "var(--primary)"
                  }} />}
                  <h1 style={{
                    fontSize: "20px",
                    fontWeight: "600",
                  }}>Two-Factor Authentication</h1>
                  <div style={{
                    maxWidth: "80%",
                    textAlign: "center",
                    fontWeight: "500",
                    fontSize: isSend ? "15px" : "14px"
                  }}>{!isSend ? "Are you sure you want to enable 2-factor authentication?" : <div>
                    Please check your phone with number <span style={{
                      textDecoration: "underline",
                      color: "var(--primary)",
                      fontWeight: "400"
                    }}>{userLogin?.phone}</span> to receive the OTP code.
                  </div>}</div>
                </div>
              }
              content={
                <div className={cx("otp-info")} style={{
                  flex: 1
                }}>
                  {isSend ? <input type="text" placeholder="Enter Your Otp" required className={cx("input-otp")} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} /> : <></>}
                  {isSend && <Count onResend={handleResendOtp} />}
                </div>
              }
              action={
                <Button className={cx("btn-agree")} disable={f2aLoading || ((!otpCode || otpCode.length < 4) && isSend)} onClick={handleEnableF2A}>
                  <div className={cx("btn-content")}>
                    <span className={cx("btn-text-agree")}>
                      {!isSend ? !f2aLoading ? "Send OTP" : <Loading className={cx("custom-loading", "sending")} /> : "Verify OTP"}
                    </span>
                  </div>
                </Button>
              }
            />
          </div>
        </div>
      </div>
      <div className={cx("btn-wrapper")}>
        <Button className={cx("btn-cancel")}
          onClick={handleResetChange}
          disable={loadingUpdateProfile}
        >Cancel</Button>
        <Button className={cx("btn-saves")} disable={validateSaveChanges() || loadingUpdateProfile}
          onClick={handleSaveProfile}
        >{!loadingUpdateProfile ? "Save Changes" : <Loading className={cx("custom-loading")} />}</Button>
      </div>
    </div>
  )
};

export default Profile;
