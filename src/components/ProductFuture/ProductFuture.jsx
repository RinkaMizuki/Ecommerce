import styles from "./ProductFuture.module.scss"
import classNames from "classnames/bind";
import Button from "../Button";
import Countdown from "react-countdown"
import { useRef, useState } from "react";

const cx = classNames.bind(styles)
const countDownDate = new Date(2024, 4, 1).getTime();
const ProductFuture = () => {

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <p>Come Into Sight!!!</p>
    } else {
      // Render a countdown
      return (
        <>
          <span className={cx("product-future-time-item")}>
            <p>{days}</p>
            <span>Days</span>
          </span>
          <span className={cx("product-future-time-item")}>
            <p>{hours}</p>
            <span>Hours</span>
          </span>
          <span className={cx("product-future-time-item")}>
            <p>{minutes}</p>
            <span>Minutes</span>
          </span>
          <span className={cx("product-future-time-item")}>
            <p>{seconds}</p>
            <span>Seconds</span>
          </span>
        </>
      )
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
        </div>
        <Button small className={cx("custom-btn-enroll")}>Enroll Now!</Button >
      </div>
      <div className={cx("product-future-img")}>
        <img src="https://tmpfiles.nohat.cc/6955669_preview.png" alt="jbl" />
      </div>
    </div>
  )
};

export default ProductFuture;
