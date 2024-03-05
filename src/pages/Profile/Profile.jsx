import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import Button from "../../components/Button";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import defaultAvatar from "../../assets/images/avatar.jpeg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import useCustomFetch from "../../hooks/useCustomFetch";
import useDebounce from "../../hooks/useDebounce";

const cx = classNames.bind(styles);

const Profile = () => {
  const userLogin = useSelector(state => state.auth.login.currentUser.user);

  const [userName, setUserName] = useState(userLogin?.userName);
  const [isExistUserName, setIsExistUserName] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(userLogin?.email);
  const [phone, setPhone] = useState(userLogin?.phone);
  const [birth, setBirth] = useState(new Date(userLogin?.birthDate).toISOString().slice(0, 10));
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);
  const [blob, setBlob] = useState(null);
  const inputFileRef = useRef(null);
  const avatarRef = useRef(null);

  const [getUserInfo] = useCustomFetch();

  const handleUploadAvatar = () => {
    inputFileRef.current.click();
  }

  const handleAvatarChange = (e) => {
    const blob = URL.createObjectURL(e.target.files[0]);
    setBlob(blob);
    setFile(e.target.files[0]);
  }

  const debounced = useDebounce(userName, 500);

  useEffect(() => {

    if (!debounced.trim()) {
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

  const validatePhoneNumber = (phone) => {
    const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return phone.match(regexPhoneNumber) ? true : false;
  }
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <div className={cx("profile-container")}>
      <h2>Edit Your Profile</h2>
      <div className={cx("info-wrapper")}>
        <div style={{
          display: "flex",
          gap: "110px",
        }}>
          <div className={cx("personal-image")}
            onClick={handleUploadAvatar}
          >
            <input type="file" hidden ref={inputFileRef} onChange={handleAvatarChange} />
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
                onChange={(e) => setUserName(e.target.value)}
              />
              {loading ? <i className={cx("fa-solid fa-spinner", "loading")}></i> : !isExistUserName ? <i className={cx("fa-regular fa-circle-check", "checked")}></i> : <i className={cx("fa-solid fa-ban", "cancel")}></i>}
            </div>
            <div className={cx("info-personal-item")}>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" placeholder="Example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={cx("info-personal-item")}>
              <label htmlFor="phone">Phone</label>
              <input type="text" name="phone" id="phone"
                placeholder="Enter your phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className={cx("info-personal-item")}>
              <label htmlFor="birthDate">Birth Date</label>
              <input type="date" name="birthDate" id="birthDate"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className={cx("info-password")}>
          <label htmlFor="currentPassword">Password Changes</label>
          <input type="password" name="currentPassword" id="currentPassword"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input type="password" name="newPassword" placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input type="password" name="confirmPassword" placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>
      <div className={cx("btn-wrapper")}>
        <Button className={cx("btn-cancel")}>Cancel</Button>
        <Button className={cx("btn-saves")} disable={isExistUserName || !email || !phone || (new Date(birth).getTime() >= new Date().getTime()) || !validatePhoneNumber(phone) || !validateEmail(email)}>Save Changes</Button>
      </div>
    </div>
  )
};

export default Profile;
