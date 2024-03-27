import styles from "./Notfound.module.scss";
import classNames from "classnames/bind";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import notfound from "../../assets/images/notfound.jpeg";

const cx = classNames.bind(styles)

const Notfound = () => {

  const navigate = useNavigate();

  function handleBackToHome() {
    navigate("/")
  }

  return (
    <div className={cx("main-container")}>
      <img src={notfound} alt="Not Found" />
      <div className={cx("error-content")}>
        <h1>404 Not Found</h1>
        <p>Your visited page not found. You may go home page.</p>
        <Button
          className={cx("notfound-btn")}
          onClick={handleBackToHome}
        >Back To Home</Button>
      </div>
    </div>
  )
};

export default Notfound;
