import classNames from "classnames/bind";
import styles from "./Return.module.scss";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "@mui/material";

const cx = classNames.bind(styles);

const Return = () => {

  return (
    <div className={cx("return-contrainer")}>
      
      This is a return page
    </div>
  )
};

export default Return;
