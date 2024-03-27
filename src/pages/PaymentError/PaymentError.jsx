import classNames from "classnames/bind";
import Button from "../../components/Button";
import styles from "./PaymentError.module.scss";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import paymentFailed from "../../assets/images/payment-failed.png";

const cx = classNames.bind(styles);

const PaymentError = () => {
  const navigate = useNavigate();
  const location = useLocation();

  function handleBackToHome() {
    navigate("/")
  }

  return (
    <>
      {location?.state?.error ? <div className={cx("payment-error-container")}>
        <img src={paymentFailed} alt="Payment Failed" />
        <div className={cx("payment-error-content")}>
          <h1>{`${location.state?.error?.statusCode} Internal Server Error`}</h1>
          <p>{location.state?.error?.message}</p>
          <Button
            className={cx("notfound-btn")}
            onClick={handleBackToHome}
          >Back To Home</Button>
        </div>
      </div> : <Navigate to="/error" replace={true} />}
    </>
  )
};

export default PaymentError;
