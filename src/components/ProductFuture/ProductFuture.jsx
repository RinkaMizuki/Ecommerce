import styles from "./ProductFuture.module.scss"
import classNames from "classnames/bind";
import Button from "../Button";
import Countdown from "react-countdown"
import { useRef, useState } from "react";

const cx = classNames.bind(styles)
const countDownDate = new Date(2024, 0, 1).getTime();
const ProductFuture = () => {

  const [ended, setEnded] = useState(false);
  const DaysRef = useRef(null);
  const HoursRef = useRef(null);
  const MinutesRef = useRef(null);
  const SecondsRef = useRef(null);

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      setEnded(completed);
    } else {
      // Render a countdown
      if (DaysRef.current != null && HoursRef.current != null && MinutesRef.current != null && SecondsRef.current != null) {
        DaysRef.current.textContent = days;
        HoursRef.current.textContent = hours;
        MinutesRef.current.textContent = minutes;
        SecondsRef.current.textContent = seconds;
      }
    }
  };

  return (
    <div className={cx("product-future-wrapper")}>
      <div className={cx("product-future-desc")}>
        <span className={cx("upcoming")}>Upcoming Product</span>
        <h1>Enhance Your Music Experience</h1>
        <div className={cx("product-future-time")}>
          <Countdown
            date={countDownDate}
            renderer={renderer}
          >
          </Countdown>
          <span className={cx("product-future-time-item")}>
            <p ref={DaysRef}>05</p>
            <span>Days</span>
          </span>
          <span className={cx("product-future-time-item")}>
            <p ref={HoursRef}>12</p>
            <span>Hours</span>
          </span>
          <span className={cx("product-future-time-item")}>
            <p ref={MinutesRef}>59</p>
            <span>Minutes</span>
          </span>
          <span className={cx("product-future-time-item")}>
            <p ref={SecondsRef}>43</p>
            <span>Seconds</span>
          </span>
        </div>
        <Button small content="Enroll Now!" className={cx("custom-btn-enroll")} />
      </div>
      <div className={cx("product-future-img")}>
        <img src="https://tmpfiles.nohat.cc/6955669_preview.png" alt="jbl" />
      </div>
    </div>
  )
};

export default ProductFuture;
