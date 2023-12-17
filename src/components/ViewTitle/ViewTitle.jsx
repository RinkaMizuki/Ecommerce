import styles from "./ViewTitle.module.scss"
import classNames from "classnames/bind"
import CountDown from "../CountDown";
import Button from "../Button";
const cx = classNames.bind(styles);

const ViewTitle = ({ className, flashsale = false, title, label, nextRef, prevRef, btnView = false, emptyBtn = false }) => {

  return (
    <div className={cx("container")}>
      <div className={cx("title-info")}>
        <div className={cx("title-time-wrapper")}>
          <div className={cx("title-time-text")}>
            <span>{label}</span>
            <h2>{title}</h2>
            <div className={cx("box-primary")}></div>
          </div>
          {flashsale && <CountDown />}
        </div>
        {!btnView ? <div className={cx("title-navigate")}>
          <i className={cx("icon-arrow-left", "fa-solid fa-arrow-left-long")} ref={prevRef}></i>
          <i className={cx("icon-arrow-right", "fa-solid fa-arrow-right-long")} ref={nextRef}></i>
        </div> : !emptyBtn ? <Button small={true} content="View All" className={className} /> : null}
      </div>
    </div>
  )
};

export default ViewTitle;
