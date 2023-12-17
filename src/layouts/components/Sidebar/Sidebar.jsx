import React from "react"
import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const Sidebar = () => {
  return (
    <div className={cx("sidebar-wrapper")}>
      <ul className={cx("sidebar-content")}>
        <li className={cx("sidebar-item")}>
          <span >Woman's Fashion </span>
          <i className="fa-solid fa-angle-right"></i>
        </li>
        <li className={cx("sidebar-item")}>
          <span >Woman's Fashion </span>
          <i className="fa-solid fa-angle-right"></i>
        </li>
        <li className={cx("sidebar-item")}>Woman's Fashion</li>
        <li className={cx("sidebar-item")}>Woman's Fashion</li>
        <li className={cx("sidebar-item")}>Woman's Fashion</li>
        <li className={cx("sidebar-item")}>Woman's Fashion</li>
        <li className={cx("sidebar-item")}>Woman's Fashion</li>
        <li className={cx("sidebar-item")}>Woman's Fashion</li>
        <li className={cx("sidebar-item")}>Woman's Fashion</li>
      </ul>
      <div className={cx("line")}></div>
    </div>
  )
};

export default Sidebar;
