import styles from "./Loading.module.scss";
import classNames from "classnames/bind";
import { default as LoadingIcon } from "../../components/Loading"

const cx = classNames.bind(styles)


const Loading = () => {
  return (
    <div className={cx("container")}>
      <div className={cx("fullsreen-loading")}>
        <div className={cx("loading-wrapper")}>
          <LoadingIcon className={cx("icon-loading")}/>
          <p>Loading, please wait...</p>
        </div>
      </div>
    </div>
  )
};

export default Loading;
