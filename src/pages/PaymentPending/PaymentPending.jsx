import classNames from "classnames/bind";
import styles from "./PaymentPending.module.scss";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles);

const PaymentPending = () => {
  const listPending = useSelector((state) => state.pending.listPending);

  return (
    <div className={cx("payment-pending-wrapper")}>
      <h1 className={cx("payment-title")}>Your Payment Pending</h1>
      <div className={cx("payment-info-wrapper")}>
        <div className={cx("payment-info-item")}>
          {listPending.map((po) => {
            const lastPo = po.payments[po.payments.length - 1];
            const orderDate = new Date(lastPo.createdAt);

            // Convert to GMT+7
            const gmtOffset = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
            const localDate = new Date(orderDate.getTime() + gmtOffset);

            const day = String(localDate.getUTCDate()).padStart(2, "0");
            const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
            const year = localDate.getUTCFullYear();
            const hours = String(localDate.getUTCHours()).padStart(2, "0");
            const minutes = String(localDate.getUTCMinutes()).padStart(2, "0");
            const seconds = String(localDate.getUTCSeconds()).padStart(2, "0");

            const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

            return (
              <div key={po.id}>
                <a
                  target="_blank"
                  href={lastPo.paymentUrl}
                  className={cx("payment-link")}
                >
                  {lastPo.paymentContent}
                </a>
                <span>Order at: {formattedDate}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;
