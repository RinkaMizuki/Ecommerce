import classNames from "classnames/bind";
import styles from "./NoSupport.module.scss";
import unsupported from "../../assets/images/not_supported.png"

const cx = classNames.bind(styles);

const NoSupport = () => {
  return (
    <div className={cx("nosupport-container")}>
      <img src={unsupported} alt="No Supported" />
      <h1>Mobile Not Supported !!!</h1>
    </div>
  )
};

export default NoSupport;
