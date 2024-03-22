import styles from "./Payment.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Payment = () => {
  return (
    <div className={cx("payment-container")}>
      Thanks for payment order
    </div>
  )
};

export default Payment;
