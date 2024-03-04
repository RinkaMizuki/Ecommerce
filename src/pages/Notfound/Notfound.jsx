import { Breadcrumbs } from "@mui/material";
import styles from "./Notfound.module.scss";
import classNames from "classnames/bind";
import Link from '@mui/material/Link';
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles)

const Notfound = () => {

  const navigate = useNavigate();

  function handleClick(event) {
    event.preventDefault();
    if (!event.target.href.split("/")[3]) {
      navigate("/")
    }
  }
  function handleBackToHome() {
    navigate("/")
  }

  return (
    <div className={cx("main-container")}>
      <div role="presentation" onClick={handleClick} className={cx("breadcrumb")}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link
            underline="hover"
            color="text.primary"
            href="/not-found"
            aria-current="page"
          >
            404 Error
          </Link>
        </Breadcrumbs>
      </div>
      <div className={cx("error-content")}>
        <h1>404 Not Found</h1>
        <p>Your visited page not found. You may go home page.</p>
        <Button
          className={cx("notfound-btn")}
          onClick={handleBackToHome}
        >Back to home page</Button>
      </div>
    </div>
  )
};

export default Notfound;
