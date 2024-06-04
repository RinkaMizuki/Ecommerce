import styles from "./ViewTitle.module.scss"
import classNames from "classnames/bind"
import CountDown from "../CountDown";
import { forwardRef } from "react";
import NavigateBtn from "./NavigateBtn";
const cx = classNames.bind(styles);

const ViewTitle = forwardRef(({ className, flashsale = false, title, label, btnView = false, emptyBtn = false, hiddenArrow = false, refs }, ref) => {
  const { nextRef, prevRef } = refs || {};
  return (
    <div className={cx("container", {
      [className]: className,
    })}>
      <div className={cx("title-info")}>
        <div className={cx("title-time-wrapper")}>
          <div className={cx("title-time-text")}>
            <span>{label}</span>
            <h2>{title}</h2>
            <div className={cx("box-primary")}></div>
          </div>
          {flashsale && <CountDown />}
        </div>
        <NavigateBtn btnView={btnView} emptyBtn={emptyBtn} hiddenArrow={hiddenArrow} refs={{
          prevRef,
          nextRef
        }} />
      </div>
    </div>
  )
});

export default ViewTitle;
