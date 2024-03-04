import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import Button from "../../components/Button";
import { useEffect, useRef, useState } from "react";

const cx = classNames.bind(styles);

const Profile = () => {

  const [blob, setBlob] = useState({});
  const inputFileRef = useRef(null);
  const avatarRef = useRef(null);

  const handleUploadAvatar = () => {
    inputFileRef.current.click();
  }

  const handleAvatarChange = (e) => {
    const blob = URL.createObjectURL(e.target.files[0]);
    avatarRef.current.src = blob;
    setBlob(blob);
  }

  useEffect(() => {

    function removeObjUrl() {
      URL.revokeObjectURL(blob);
    }

    avatarRef?.current?.addEventListener("load", removeObjUrl)

    return () => {
      avatarRef?.current?.removeEventListener("load", removeObjUrl)
    }

  }, [blob])

  return (
    <div className={cx("profile-container")}>
      <h2>Edit Your Profile</h2>
      <div className={cx("info-wrapper")}>
        <div style={{
          display: "flex",
          gap: "70px",
        }}>
          <div className={cx("personal-image")}
            onClick={handleUploadAvatar}
          >
            <input type="file" hidden ref={inputFileRef} onChange={handleAvatarChange} />
            <figure className={cx("personal-figure")}>
              <img src="https://avatars1.githubusercontent.com/u/11435231?s=460&v=4" className={cx("personal-avatar")} alt="avatar" ref={avatarRef} />
              <figcaption className={cx("personal-figcaption")}>
                <img src="https://raw.githubusercontent.com/ThiagoLuizNunes/angular-boilerplate/master/src/assets/imgs/camera-white.png" />
              </figcaption>
            </figure>
          </div>
          <div className={cx("info-personal")}>

            <div className={cx("info-personal-item")}>
              <label htmlFor="userName">User Name</label>
              <input type="text" name="userName" id="userName" placeholder="Name" />
            </div>
            <div className={cx("info-personal-item")}>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" placeholder="example@gmail.com" />
            </div>
            <div className={cx("info-personal-item")}>
              <label htmlFor="phone">Phone</label>
              <input type="text" name="phone" id="phone"
                placeholder="0984892281"
              />
            </div>
            <div className={cx("info-personal-item")}>
              <label htmlFor="birthDate">Birth Date</label>
              <input type="date" name="birthDate" id="birthDate" />
            </div>
          </div>
        </div>
        <div className={cx("info-password")}>
          <label htmlFor="currentPassword">Password Changes</label>
          <input type="password" name="currentPassword" id="currentPassword"
            placeholder="Current Password"
          />
          <input type="password" name="newPassword" placeholder="New password" />
          <input type="password" name="birthDate" placeholder="Confirm New Password" />
        </div>
      </div>
      <div className={cx("btn-wrapper")}>
        <Button className={cx("btn-cancel")}>Cancel</Button>
        <Button className={cx("btn-saves")}>Save Changes</Button>
      </div>
    </div>
  )
};

export default Profile;
